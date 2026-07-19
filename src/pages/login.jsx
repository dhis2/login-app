import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
    ApplicationNotification,
    FormContainer,
    FormSubtitle,
    LoginLinks,
    OIDCLoginOptions,
} from '../components/index.js'
import { useLogin } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import { LoginForm } from './login/index.js'

export default function LoginPage() {
    return (
        <>
            <LoginFormContainer />
            <ApplicationNotification />
        </>
    )
}

// this is set up this way to isolate styling from login form logic
export const LoginFormContainer = () => {
    const {
        login,
        cancelTwoFA,
        resendTwoFACode,
        twoFAVerificationRequired,
        OTPtwoFAVerificationRequired,
        emailtwoFAVerificationRequired,
        emailTwoFAIncorrect,
        twoFAIncorrect,
        accountInaccessible,
        passwordExpired,
        twoFACodeRequired,
        unknownStatus,
        error,
        loading,
    } = useLogin()
    const [formUserName, setFormUserName] = useState('')
    const { lngs, allowAccountRecovery, emailConfigured } = useLoginConfig()
    const passwordResetEnabled = allowAccountRecovery && emailConfigured

    if (passwordExpired) {
        const usernameQuery = formUserName
            ? `?username=${encodeURIComponent(formUserName)}`
            : ''
        return (
            <Navigate
                to={
                    passwordResetEnabled
                        ? `/reset-password${usernameQuery}`
                        : `/change-expired-password${usernameQuery}`
                }
                replace
            />
        )
    }

    return (
        <FormContainer
            title={
                twoFAVerificationRequired
                    ? i18n.t('Two-factor authentication', { lngs })
                    : i18n.t('Log in', { lngs })
            }
        >
            {(OTPtwoFAVerificationRequired || twoFAIncorrect) && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'Enter the code from your two-factor authentication app to log in.',
                            { lngs }
                        )}
                    </p>
                </FormSubtitle>
            )}
            {(emailtwoFAVerificationRequired || emailTwoFAIncorrect) && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'We have sent you an email with your authentication code. Enter it below to log in.',
                            { lngs }
                        )}
                    </p>
                </FormSubtitle>
            )}
            <LoginForm
                setFormUserName={setFormUserName}
                lngs={lngs}
                login={login}
                cancelTwoFA={cancelTwoFA}
                resendTwoFACode={resendTwoFACode}
                twoFAVerificationRequired={twoFAVerificationRequired}
                emailtwoFAVerificationRequired={emailtwoFAVerificationRequired}
                twoFAIncorrect={twoFAIncorrect}
                emailTwoFAIncorrect={emailTwoFAIncorrect}
                twoFACodeRequired={twoFACodeRequired}
                accountInaccessible={accountInaccessible}
                unknownStatus={unknownStatus}
                error={error}
                loading={loading}
            />
            {!twoFAVerificationRequired && (
                <>
                    <LoginLinks formUserName={formUserName} />
                    <OIDCLoginOptions />
                </>
            )}
        </FormContainer>
    )
}
