import { useDataMutation } from '@dhis2/app-runtime'
import { useState } from 'react'
import { redirectTo, getRedirectString } from '../helpers/index.js'
import { useLoginConfig } from '../providers/index.js'

const LOGIN_STATUSES = {
    incorrect2fa: 'INCORRECT_TWO_FACTOR_CODE',
    incorrect2faEmail: 'EMAIL_TWO_FACTOR_CODE_SENT',
    incorrect2faTOTP: 'INCORRECT_TWO_FACTOR_CODE_TOTP',
    notEnabled2fa: 'INVALID',
    success: 'SUCCESS',
    secondAttempt2fa: 'second_attempt_incorrect_2fa', // this is internal logic to app
    secondAttempt2faEmail: 'second_attempt_incorrect_2fa_email',
    secondAttempt2faTOTP: 'second_attempt_incorrect_2fa_OTP',
    success2fa: 'SUCCESS_2fa',
    passwordExpired: 'PASSWORD_EXPIRED',
    accountDisabled: 'ACCOUNT_DISABLED',
    accountLocked: 'ACCOUNT_LOCKED',
    accountExpired: 'ACCOUNT_EXPIRED',
}
const invalidTWOFA = [
    LOGIN_STATUSES.incorrect2fa,
    LOGIN_STATUSES.incorrect2faEmail,
    LOGIN_STATUSES.incorrect2faTOTP,
    LOGIN_STATUSES.secondAttempt2fa,
    LOGIN_STATUSES.secondAttempt2faTOTP,
    LOGIN_STATUSES.secondAttempt2faEmail,
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
        setLoginStatus((prev) => {
            if (invalidTWOFA.includes(prev)) {
                if (
                    prev === LOGIN_STATUSES.incorrect2faEmail ||
                    prev === LOGIN_STATUSES.secondAttempt2faEmail
                ) {
                    return LOGIN_STATUSES.secondAttempt2faEmail
                }
                if (
                    prev === LOGIN_STATUSES.incorrect2fa ||
                    prev === LOGIN_STATUSES.secondAttempt2fa
                ) {
                    return LOGIN_STATUSES.secondAttempt2fa
                }
                if (
                    prev === LOGIN_STATUSES.incorrect2faTOTP ||
                    prev === LOGIN_STATUSES.secondAttempt2faTOTP
                ) {
                    return LOGIN_STATUSES.secondAttempt2faTOTP
                }
                if (response.loginStatus === LOGIN_STATUSES.success) {
                    return LOGIN_STATUSES.success2fa
                }
            }

            return response.loginStatus
        })

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
        OTPtwoFAVerificationRequired:
            loginStatus === LOGIN_STATUSES.incorrect2faTOTP,
        emailtwoFAVerificationRequired:
            loginStatus === LOGIN_STATUSES.incorrect2faEmail,
        twoFAIncorrect:
            loginStatus === LOGIN_STATUSES.secondAttempt2fa ||
            loginStatus === LOGIN_STATUSES.secondAttempt2faTOTP,
        emailTwoFAIncorrect:
            loginStatus === LOGIN_STATUSES.secondAttempt2faEmail,
        twoFANotEnabled: loginStatus === LOGIN_STATUSES.notEnabled2fa,
        passwordExpired: loginStatus === LOGIN_STATUSES.passwordExpired,
        accountInaccessible: inaccessibleAccountStatuses.includes(loginStatus),
        unknownStatus:
            loginStatus !== null &&
            !Object.values(LOGIN_STATUSES).includes(loginStatus),
    }
}
