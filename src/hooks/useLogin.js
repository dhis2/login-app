import { useDataMutation } from '@dhis2/app-runtime'
import { useState } from 'react'
import { redirectTo, getRedirectString } from '../helpers/index.js'
import { useLoginConfig } from '../providers/index.js'

const LOGIN_STATUSES = {
    incorrect2fa: 'INCORRECT_TWO_FACTOR_CODE',
    notEnabled2fa: 'INVALID',
    success: 'SUCCESS',
    secondAttempt2fa: 'second_attempt_incorrect_2fa', // this is internal logic to app
    success2fa: 'SUCCESS_2fa',
    passwordExpired: 'PASSWORD_EXPIRED',
    accountDisabled: 'ACCOUNT_DISABLED',
    accountLocked: 'ACCOUNT_LOCKED',
    accountExpired: 'ACCOUNT_EXPIRED',
}
const invalidTWOFA = [
    LOGIN_STATUSES.incorrect2fa,
    LOGIN_STATUSES.secondAttempt2fa,
]
const inaccessibleAccountStatuses = [
    LOGIN_STATUSES.accountDisabled,
    LOGIN_STATUSES.accountLocked,
    LOGIN_STATUSES.accountExpired,
]

const loginMutation = {
    resource: 'auth/login',
    type: 'create',
    data: ({ username, password, twoFA }) =>
        twoFA
            ? { username, password, twoFactorCode: twoFA }
            : { username, password },
}

export const useLogin = () => {
    const { baseUrl, hashRedirect } = useLoginConfig()
    const [loginStatus, setLoginStatus] = useState(null)
    const [error, setError] = useState(null)

    const cancelTwoFA = () => {
        setError(null)
        setLoginStatus(null)
    }

    const handleSuccessfulLogin = (response) => {
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
            const redirectString = getRedirectString({
                response,
                baseUrl,
                hashRedirect,
            })
            redirectTo(redirectString)
        }
    }

    const handleUnsuccessfulLogin = (error) => {
        console.error(error)
        setLoginStatus(null)
        setError(error)
    }

    const [login, { loading, fetching }] = useDataMutation(loginMutation, {
        onComplete: (response) => {
            handleSuccessfulLogin(response)
        },
        onError: (error) => {
            handleUnsuccessfulLogin(error)
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
        passwordExpired: loginStatus === LOGIN_STATUSES.passwordExpired,
        accountInaccessible: inaccessibleAccountStatuses.includes(loginStatus),
    }
}
