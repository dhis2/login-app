import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
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
                passwordExpired={passwordExpired}
                passwordResetEnabled={allowAccountRecovery && emailConfigured}
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
