import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm, InputFieldFF, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-final-form'
import {
    ApplicationNotification,
    FormContainer,
    FormNotice,
    FormSubtitle,
    LoginLinks,
} from '../components/index.js'
import { checkIsFormValid, getIsRequired } from '../helpers/index.js'
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

const InnerLoginForm = ({
    handleSubmit,
    formSubmitted,
    twoFAVerificationRequired,
    cancelTwoFA,
    uiLocale,
    loading,
    setFormUserName,
}) => {
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
        ? i18n.t('Verify and log in', { lng: uiLocale })
        : i18n.t('Log in', { lng: uiLocale })
    const login2FAButtonText = twoFAVerificationRequired
        ? i18n.t('Verifying...', { lng: uiLocale })
        : i18n.t('Logging in...', { lng: uiLocale })
    const isRequired = getIsRequired(uiLocale)
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
                    label={i18n.t('Username', { lng: uiLocale })}
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
                    label={i18n.t('Password', { lng: uiLocale })}
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
                    label={i18n.t('Authentication code', { lng: uiLocale })}
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
                {twoFAVerificationRequired && (
                    <Button secondary disabled={loading} onClick={clearTwoFA}>
                        {i18n.t('Cancel', { lng: uiLocale })}
                    </Button>
                )}
            </div>
        </form>
    )
}

InnerLoginForm.defaultProps = {
    uiLocale: 'en',
}

InnerLoginForm.propTypes = {
    cancelTwoFA: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    twoFAVerificationRequired: PropTypes.bool.isRequired,
    formSubmitted: PropTypes.bool,
    loading: PropTypes.bool,
    setFormUserName: PropTypes.func,
    uiLocale: PropTypes.string,
}

const LoginForm = ({
    setFormUserName,
    setTwoFAVerificationRequired,
    uiLocale,
}) => {
    const {
        login,
        cancelTwoFA,
        twoFAVerificationRequired,
        twoFAIncorrect,
        error,
        loading,
    } = useLogin()

    useEffect(() => {
        if (setTwoFAVerificationRequired) {
            setTwoFAVerificationRequired(twoFAVerificationRequired)
        }
    }, [twoFAVerificationRequired, setTwoFAVerificationRequired])

    const [formSubmitted, setFormSubmitted] = useState(false)

    if (!login) {
        return null
    }
    const isRequired = getIsRequired(uiLocale)
    const handleLogin = (values) => {
        setFormSubmitted(true)
        const validatorsByField = {
            username: {
                value: values.username,
                validator: isRequired,
            },
            password: {
                value: values.password,
                validator: isRequired,
            },
        }
        if (!checkIsFormValid(validatorsByField)) {
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
            {error && (
                <FormNotice
                    title={
                        error.httpStatusCode >= 500
                            ? i18n.t('Something went wrong', {
                                  lng: uiLocale,
                              })
                            : i18n.t('Incorrect username or password', {
                                  lng: uiLocale,
                              })
                    }
                    error
                >
                    {!error.httpStatusCode >= 500 && (
                        <span>{error?.message}</span>
                    )}
                </FormNotice>
            )}
            {twoFAIncorrect && (
                <FormNotice
                    title={i18n.t('Incorrect authentication code', {
                        lng: uiLocale,
                    })}
                    error
                />
            )}
            <ReactFinalForm.Form onSubmit={handleLogin}>
                {({ handleSubmit }) => (
                    <InnerLoginForm
                        handleSubmit={handleSubmit}
                        formSubmitted={formSubmitted}
                        twoFAVerificationRequired={twoFAVerificationRequired}
                        twoFAIncorrect={twoFAIncorrect}
                        cancelTwoFA={cancelTwoFA}
                        uiLocale={uiLocale}
                        loading={loading}
                        setFormUserName={setFormUserName}
                    />
                )}
            </ReactFinalForm.Form>
        </>
    )
}

LoginForm.defaultProps = {
    uiLocale: 'en',
}

LoginForm.propTypes = {
    setFormUserName: PropTypes.func,
    setTwoFAVerificationRequired: PropTypes.func,
    uiLocale: PropTypes.string,
}

// this is set up this way to isolate styling from login form logic
const LoginFormContainer = () => {
    const [twoFAVerificationRequired, setTwoFAVerificationRequired] =
        useState(false)
    const [formUserName, setFormUserName] = useState('')
    const { uiLocale } = useLoginConfig()

    return (
        <FormContainer
            title={
                twoFAVerificationRequired
                    ? i18n.t('Two-factor authentication', { lng: uiLocale })
                    : i18n.t('Log in', { lng: uiLocale })
            }
        >
            {twoFAVerificationRequired && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'Enter the code from your two-factor authentication app to log in.',
                            { lng: uiLocale }
                        )}
                    </p>
                </FormSubtitle>
            )}
            <LoginForm
                setFormUserName={setFormUserName}
                setTwoFAVerificationRequired={setTwoFAVerificationRequired}
                uiLocale={uiLocale}
            />
            {!twoFAVerificationRequired && (
                <LoginLinks formUserName={formUserName} />
            )}
        </FormContainer>
    )
}
