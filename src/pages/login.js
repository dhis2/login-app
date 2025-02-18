import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm, InputFieldFF, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useForm } from 'react-final-form'
import { Link } from 'react-router-dom'
import {
    ApplicationNotification,
    FormContainer,
    FormNotice,
    FormSubtitle,
    LoginLinks,
    OIDCLoginOptions,
} from '../components/index.js'
import { checkIsLoginFormValid, getIsRequired } from '../helpers/index.js'
import { useLogin } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './login.module.css'

export default function LoginPage() {
    return (
        <>
            <LoginFormContainer />
            <ApplicationNotification />
        </>
    )
}

const LoginErrors = ({
    lngs,
    error,
    twoFAIncorrect,
    passwordExpired,
    passwordResetEnabled,
    accountInaccessible,
    unknownStatus,
}) => {
    if (error) {
        return (
            <FormNotice
                title={
                    !error?.details?.httpStatusCode ||
                    error.details.httpStatusCode >= 500
                        ? i18n.t('Something went wrong', {
                              lngs,
                          })
                        : i18n.t('Incorrect username or password', {
                              lngs,
                          })
                }
                error
            >
                {(!error.details?.httpStatusCode ||
                    error.details.httpStatusCode >= 500) && (
                    <span>{error?.message}</span>
                )}
            </FormNotice>
        )
    }

    if (twoFAIncorrect) {
        return (
            <FormNotice
                title={i18n.t('Incorrect authentication code', {
                    lngs,
                })}
                error
            />
        )
    }
    if (passwordExpired) {
        return (
            <FormNotice
                title={i18n.t('Password expired', {
                    lngs,
                })}
                error
            >
                {passwordResetEnabled ? (
                    <Link to="/reset-password">
                        {i18n.t(
                            'You can reset your password from the password reset page.'
                        )}
                    </Link>
                ) : (
                    i18n.t('Contact your system administrator.')
                )}
            </FormNotice>
        )
    }
    if (accountInaccessible) {
        return (
            <FormNotice
                title={i18n.t('Account not accessible', {
                    lngs,
                })}
                error
            >
                {i18n.t('Contact your system administrator.')}
            </FormNotice>
        )
    }
    if (unknownStatus) {
        return (
            <FormNotice
                title={i18n.t('Something went wrong', {
                    lngs,
                })}
                error
            >
                {i18n.t('Contact your system administrator.')}
            </FormNotice>
        )
    }
    return null
}

LoginErrors.propTypes = {
    accountInaccessible: PropTypes.bool,
    error: PropTypes.object,
    lngs: PropTypes.arrayOf(PropTypes.string),
    passwordExpired: PropTypes.bool,
    passwordResetEnabled: PropTypes.bool,
    twoFAIncorrect: PropTypes.bool,
    unknownStatus: PropTypes.bool,
}

const InnerLoginForm = ({
    handleSubmit,
    formSubmitted,
    twoFAVerificationRequired,
    emailtwoFAVerificationRequired,
    cancelTwoFA,
    lngs,
    loading,
    setFormUserName,
}) => {
    const [isResendDisabled, setIsResendDisabled] = useState(false)

    const resendCode = () => {
        setIsResendDisabled(true)
        handleSubmit()
        setTimeout(() => {
            setIsResendDisabled(false)
        }, 30000)
    }

    const form = useForm()
    const ref = useRef()
    const clearTwoFA = () => {
        form.change('password', undefined)
        form.change('twoFA', undefined)
        form.focus()
        cancelTwoFA()
        ref?.current?.focus()
    }
    const loginButtonText = twoFAVerificationRequired
        ? i18n.t('Verify and log in', { lngs })
        : i18n.t('Log in', { lngs })
    const login2FAButtonText = twoFAVerificationRequired
        ? i18n.t('Verifying...', { lngs })
        : i18n.t('Logging in...', { lngs })
    const isRequired = getIsRequired(lngs[0])

    return (
        <form onSubmit={handleSubmit}>
            <div
                className={
                    twoFAVerificationRequired ? styles.hiddenFields : null
                }
            >
                {/* onChange will not update every change, so may need to use controlled InputField here for username tracking */}
                <ReactFinalForm.Field
                    name="username"
                    label={i18n.t('Username', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={!formSubmitted ? null : isRequired}
                    key={formSubmitted ? 1 : 0}
                    initialFocus={!twoFAVerificationRequired}
                    onBlur={(e) => {
                        setFormUserName(e.value)
                    }}
                    readOnly={loading}
                />
                <ReactFinalForm.Field
                    name="password"
                    label={i18n.t('Password', { lngs })}
                    type="password"
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={!formSubmitted ? null : isRequired}
                    key={formSubmitted ? 2 : 3}
                    readOnly={loading}
                />
            </div>

            <div
                className={
                    !twoFAVerificationRequired ? styles.hiddenFields : ''
                }
            >
                <ReactFinalForm.Field
                    name="twoFA"
                    label={i18n.t('Authentication code', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    initialValue=""
                    initialFocus={twoFAVerificationRequired}
                    readOnly={loading}
                />
            </div>
            <div className={styles.formButtons}>
                <Button type="submit" disabled={loading} primary>
                    {loading ? login2FAButtonText : loginButtonText}
                </Button>
                {emailtwoFAVerificationRequired && (
                    <Button
                        secondary
                        disabled={isResendDisabled || loading}
                        type="button"
                        onClick={resendCode}
                    >
                        {i18n.t('Resend Code', { lngs })}
                    </Button>
                )}
                {twoFAVerificationRequired && (
                    <Button secondary disabled={loading} onClick={clearTwoFA}>
                        {i18n.t('Cancel', { lngs })}
                    </Button>
                )}
            </div>
        </form>
    )
}

InnerLoginForm.defaultProps = {
    lngs: ['en'],
}

InnerLoginForm.propTypes = {
    cancelTwoFA: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    emailtwoFAVerificationRequired: PropTypes.bool,
    formSubmitted: PropTypes.bool,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    setFormUserName: PropTypes.func,
    twoFAVerificationRequired: PropTypes.bool,
}

const LoginForm = ({
    login,
    cancelTwoFA,
    twoFAVerificationRequired,
    emailtwoFAVerificationRequired,
    twoFAIncorrect,
    accountInaccessible,
    passwordExpired,
    passwordResetEnabled,
    unknownStatus,
    error,
    loading,
    setFormUserName,
    lngs,
}) => {
    const [formSubmitted, setFormSubmitted] = useState(false)

    if (!login) {
        return null
    }

    const handleLogin = (values) => {
        setFormSubmitted(true)
        if (!checkIsLoginFormValid(values)) {
            return
        }
        login({
            username: values.username,
            password: values.password,
            twoFA: values.twoFA,
        })
    }

    return (
        <>
            <LoginErrors
                lngs={lngs}
                error={error}
                twoFAIncorrect={twoFAIncorrect}
                passwordExpired={passwordExpired}
                passwordResetEnabled={passwordResetEnabled}
                accountInaccessible={accountInaccessible}
                unknownStatus={unknownStatus}
            />

            <ReactFinalForm.Form onSubmit={handleLogin}>
                {({ handleSubmit }) => (
                    <InnerLoginForm
                        handleSubmit={handleSubmit}
                        formSubmitted={formSubmitted}
                        twoFAVerificationRequired={twoFAVerificationRequired}
                        emailtwoFAVerificationRequired={
                            emailtwoFAVerificationRequired
                        }
                        twoFAIncorrect={twoFAIncorrect}
                        cancelTwoFA={cancelTwoFA}
                        lngs={lngs}
                        loading={loading}
                        setFormUserName={setFormUserName}
                    />
                )}
            </ReactFinalForm.Form>
        </>
    )
}

LoginForm.defaultProps = {
    lngs: ['en'],
}

LoginForm.propTypes = {
    accountInaccessible: PropTypes.bool,
    cancelTwoFA: PropTypes.func,
    emailtwoFAVerificationRequired: PropTypes.bool,
    error: PropTypes.object,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    login: PropTypes.func,
    passwordExpired: PropTypes.bool,
    passwordResetEnabled: PropTypes.bool,
    setFormUserName: PropTypes.func,
    twoFAIncorrect: PropTypes.bool,
    twoFAVerificationRequired: PropTypes.bool,
    unknownStatus: PropTypes.bool,
}

// this is set up this way to isolate styling from login form logic
export const LoginFormContainer = () => {
    const {
        login,
        cancelTwoFA,
        twoFAVerificationRequired,
        OTPtwoFAVerificationRequired,
        emailtwoFAVerificationRequired,
        twoFAIncorrect,
        accountInaccessible,
        passwordExpired,
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
            {OTPtwoFAVerificationRequired && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'Enter the code from your two-factor authentication app to log in.',
                            { lngs }
                        )}
                    </p>
                </FormSubtitle>
            )}
            {emailtwoFAVerificationRequired && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'We have sent you an email with your authentication code, enter it below to log in',
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
                twoFAVerificationRequired={twoFAVerificationRequired}
                emailtwoFAVerificationRequired={emailtwoFAVerificationRequired}
                twoFAIncorrect={twoFAIncorrect}
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
