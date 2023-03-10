import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm, InputFieldFF, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-final-form'
import { Link } from 'react-router-dom'
import { ApplicationNotification } from '../components/application-notification.js'
import { FormContainer } from '../components/form-container.js'
import { FormNotice } from '../components/form-notice.js'
import { FormSubtitle } from '../components/form-subtitle.js'
import { getIsRequired } from '../helpers/index.js'
import { useLogin } from '../hooks/index.js'
import { useLoginConfig } from '../providers/use-login-config.js'

export default function LoginPage() {
    return (
        <>
            <LoginFormContainer />
            <ApplicationNotification />
        </>
    )
}

const Links = ({ formUserName }) => {
    const {
        allowAccountRecovery,
        emailConfigured,
        selfRegistrationEnabled,
        uiLocale,
    } = useLoginConfig()

    return (
        <>
            <div className="links">
                {allowAccountRecovery && emailConfigured && (
                    <span>
                        <Link to={`/reset-password?username=${formUserName}`}>
                            {i18n.t('Forgot password?', { lng: uiLocale })}
                        </Link>
                    </span>
                )}
                {selfRegistrationEnabled && (
                    <span>
                        {i18n.t("Don't have an account?", { lng: uiLocale })}{' '}
                        <Link to="/create-account">
                            {i18n.t('Create an account', { lng: uiLocale })}
                        </Link>
                    </span>
                )}
            </div>
            <style>
                {`
      .links {
        display: flex;
        flex-direction: column;
        gap: var(--spacers-dp8);
      }
      .links span,
      .links a {
        color: var(--colors-grey900);
        font-size: 14px;
      }
    `}
            </style>
        </>
    )
}

Links.propTypes = {
    formUserName: PropTypes.string,
}

const InnerLoginForm = ({
    handleSubmit,
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
    const isRequired = getIsRequired(uiLocale)
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div
                    className={twoFAVerificationRequired ? 'hiddenFields' : ''}
                >
                    {/* onChange will not update every change, so may need to use controlled InputField here for username tracking */}
                    <ReactFinalForm.Field
                        name="username"
                        label={i18n.t('Username', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={'inputField'}
                        validate={(val) =>
                            !val
                                ? i18n.t('This field is required', {
                                      lng: uiLocale,
                                  })
                                : null
                        }
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
                        className={'inputField'}
                        validate={isRequired}
                        readOnly={loading}
                    />
                </div>

                <div
                    className={!twoFAVerificationRequired ? 'hiddenFields' : ''}
                >
                    <ReactFinalForm.Field
                        name="twoFA"
                        label={i18n.t('Authentication code', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={'inputField'}
                        initialValue=""
                        initialFocus={twoFAVerificationRequired}
                        readOnly={loading}
                    />
                </div>
                <div className="formButtons">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                        primary
                    >
                        {loading
                            ? i18n.t('Logging in', { lng: uiLocale })
                            : loginButtonText}
                    </Button>
                    {twoFAVerificationRequired && (
                        <Button
                            secondary
                            disabled={loading}
                            onClick={clearTwoFA}
                            className="login-btn"
                        >
                            {i18n.t('Cancel', { lng: uiLocale })}
                        </Button>
                    )}
                </div>
            </form>
            <style>
                {`
        .inputField {
          margin-bottom: var(--spacers-dp8);
        }
        .hiddenFields {
          display:none;
        }
        .formButtons {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);          
          margin-bottom: var(--spacers-dp16);
        }
        .login-btn {
          width: 100%;
        }          
      `}
            </style>
        </>
    )
}

InnerLoginForm.defaultProps = {
    uiLocale: 'en',
}

InnerLoginForm.propTypes = {
    cancelTwoFA: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    twoFAVerificationRequired: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    setFormUserName: PropTypes.func,
    uiLocale: PropTypes.string,
}

const LoginForm = ({
    setFormUserName,
    setTwoFAVerificationRequired,
    uiLocale,
}) => {
    const { login, cancelTwoFA, twoFAVerificationRequired, error, loading } =
        useLogin({ redirectTo: 'http://www.dhis2.org' })

    useEffect(() => {
        if (setTwoFAVerificationRequired) {
            setTwoFAVerificationRequired(twoFAVerificationRequired)
        }
    }, [twoFAVerificationRequired, setTwoFAVerificationRequired])

    if (!login) {
        return null
    }
    const handleLogin = (values) => {
        login({
            username: values.username,
            password: values.password,
            twoFA: values.twoFA,
        })
    }

    return (
        <>
            <div className="form-fields">
                <div className={'styles.container'}>
                    {error && (
                        <FormNotice
                            title={i18n.t('Incorrect username or password', {
                                lng: uiLocale,
                            })}
                            error={true}
                        />
                    )}
                    <ReactFinalForm.Form onSubmit={handleLogin}>
                        {({ handleSubmit }) => (
                            <InnerLoginForm
                                handleSubmit={handleSubmit}
                                twoFAVerificationRequired={
                                    twoFAVerificationRequired
                                }
                                cancelTwoFA={cancelTwoFA}
                                uiLocale={uiLocale}
                                loading={loading}
                                setFormUserName={setFormUserName}
                            />
                        )}
                    </ReactFinalForm.Form>
                </div>
            </div>
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
            width="368px"
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
                <Links formUserName={formUserName} />
            )}
            <style>
                {`
        .form-fields {
          min-width: 320px;
          display: flex;
          flex-direction: column;
        }
        .inputs {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
          margin-bottom: var(--spacers-dp12);
        }
      `}
            </style>
        </FormContainer>
    )
}
