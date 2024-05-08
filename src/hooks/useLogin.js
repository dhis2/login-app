import { useDataMutation } from '@dhis2/app-runtime'
import { useState } from 'react'
import { useLoginConfig } from '../providers/index.js'

const LOGIN_STATUSES = {
    incorrect2fa: 'INCORRECT_TWO_FACTOR_CODE',
    notEnabled2fa: 'INVALID',
    success: 'SUCCESS',
    secondAttempt2fa: 'second_attempt_incorrect_2fa', // this is internal logic to app
    success2fa: 'SUCCESS_2fa',
}
const invalidTWOFA = [
    LOGIN_STATUSES.incorrect2fa,
    LOGIN_STATUSES.secondAttempt2fa,
]

// To be updated based on https://dhis2.atlassian.net/browse/DHIS2-14613

const getRedirectString = ({ response, baseUrl }) => {
    if (process.env.NODE_ENV === 'development') {
        return baseUrl + response?.redirectUrl
    }
    return response.redirectUrl ? `${response.redirectUrl}` : baseUrl
}

const loginMutation = {
    resource: 'auth/login',
    type: 'create',
    data: ({ username, password, twoFA }) =>
        twoFA
            ? { username, password, twoFactorCode: twoFA }
            : { username, password },
}

export const useLogin = () => {
    const { baseUrl } = useLoginConfig()
    const [loginStatus, setLoginStatus] = useState(null)
    const [error, setError] = useState(null)

    const cancelTwoFA = () => {
        setError(null)
        setLoginStatus(null)
    }

    const [login, { loading, fetching }] = useDataMutation(loginMutation, {
        onComplete: (response) => {
            setError(null)
            // we need to distinguish between incorrect 2fa on second attempt
            setLoginStatus((prev) =>
                invalidTWOFA.includes(prev)
                    ? response.loginStatus === LOGIN_STATUSES.success
                        ? LOGIN_STATUSES.success2fa
                        : LOGIN_STATUSES.secondAttempt2fa
                    : response.loginStatus
            )

            if (response.loginStatus === LOGIN_STATUSES.success) {
                const redirectString = getRedirectString({ response, baseUrl })
                window.location.href = redirectString
            }
        },
        onError: (e) => {
            console.error(e)
            setLoginStatus(null)
            setError(e)
        },
    })

    return {
        login,
        cancelTwoFA,
        loading:
            loading ||
            fetching ||
            [LOGIN_STATUSES.success, LOGIN_STATUSES.success2fa].includes(
                loginStatus
            ),
        error,
        twoFAVerificationRequired:
            invalidTWOFA.includes(loginStatus) ||
            loginStatus === LOGIN_STATUSES.success2fa,
        twoFAIncorrect: loginStatus === LOGIN_STATUSES.secondAttempt2fa,
        twoFANotEnabled: loginStatus === LOGIN_STATUSES.notEnabled2fa,
    }
}
