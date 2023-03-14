import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ReactFinalForm, InputFieldFF } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { FormContainer } from '../components/form-container.js'
import { FormNotice } from '../components/form-notice.js'
import { FormSubtitle } from '../components/form-subtitle.js'
import { getIsRequired } from '../helpers/validators.js'
import { useRedirectIfNotAllowed } from '../hooks/index.js'
import { useLoginConfig } from '../providers/use-login-config.js'

const passwordResetMutation = {
    resource: 'auth/forgotPassword',
    type: 'create',
    data: ({ emailOrUsername }) => ({ emailOrUsername }),
}

const InnerPasswordResetForm = ({ handleSubmit, uiLocale, loading }) => {
    const isRequired = getIsRequired(uiLocale)
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <ReactFinalForm.Field
                        name="emailOrUsername"
                        label={i18n.t('Username or email', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={'inputField'}
                        validate={isRequired}
                        initialFocus
                        readOnly={loading}
                    />
                </div>
                <div className="formButtons">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="reset-btn"
                        primary
                    >
                        {loading
                            ? i18n.t('Sending...', { lng: uiLocale })
                            : i18n.t('Send password reset request form', {
                                  lng: uiLocale,
                              })}
                    </Button>
                    <Link className="no-underline" to="/">
                        <Button
                            secondary
                            disabled={loading}
                            className="reset-btn"
                        >
                            {i18n.t('Cancel', { lng: uiLocale })}
                        </Button>
                    </Link>
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
        .reset-btn {
          width: 100%;
        }
        .no-underline {
          text-decoration: none;
        }
      `}
            </style>
        </>
    )
}

InnerPasswordResetForm.propTypes = {
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    uiLocale: PropTypes.string,
}

export const PasswordResetForm = ({ uiLocale }) => {
    // depends on https://dhis2.atlassian.net/browse/DHIS2-14618
    const [resetPassword, { loading, fetching, error, data }] = useDataMutation(
        passwordResetMutation
    )

    const handlePasswordReset = (values) => {
        resetPassword({ emailOrUsername: values.emailOrUsername })
    }
    return (
        <>
            <div>
                <div>
                    {error && (
                        <FormNotice
                            title={i18n.t('Incorrect username or password', {
                                lng: uiLocale,
                            })}
                            error={true}
                        />
                    )}
                    {data && (
                        <FormNotice valid={true}>
                            <span>
                                {i18n.t(
                                    'We’ve sent an email with a password reset link to your registered email address.',
                                    { lng: uiLocale }
                                )}
                            </span>
                        </FormNotice>
                    )}
                    <ReactFinalForm.Form onSubmit={handlePasswordReset}>
                        {({ handleSubmit }) => (
                            <InnerPasswordResetForm
                                handleSubmit={handleSubmit}
                                uiLocale={uiLocale}
                                loading={loading || fetching}
                            />
                        )}
                    </ReactFinalForm.Form>
                </div>
            </div>
        </>
    )
}

PasswordResetForm.defaultProps = {
    uiLocale: 'en',
}

PasswordResetForm.propTypes = {
    uiLocale: PropTypes.string,
}

const requiredPropsForPasswordReset = [
    'allowAccountRecovery',
    'emailConfigured',
]

const PasswordResetFormPage = () => {
    const { uiLocale } = useLoginConfig()
    useRedirectIfNotAllowed(requiredPropsForPasswordReset)

    return (
        <>
            <FormContainer
                width="368px"
                title={i18n.t('Reset password', { lng: uiLocale })}
            >
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'Enter your username below, a link to reset your password will be sent to your registered e-mail.',
                            { lng: uiLocale }
                        )}
                    </p>
                </FormSubtitle>
                <PasswordResetForm uiLocale={uiLocale} />
                <style>
                    {`
        .pw-request-form-fields {
          min-width: 320px;
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp16);
        }
        .inputs {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
          margin-bottom: var(--spacers-dp12);
        }
        .form-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
        }
        .reset-submit-btn, .reset-cancel-btn {
          width: 100%;
        }
      `}
                </style>
            </FormContainer>
        </>
    )
}

export default PasswordResetFormPage
