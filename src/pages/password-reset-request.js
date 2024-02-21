import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ReactFinalForm, InputFieldFF } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    BackToLoginButton,
    FormContainer,
    FormNotice,
    FormSubtitle,
    NotAllowedNotice,
} from '../components/index.js'
import { getIsRequired } from '../helpers/index.js'
import { useGetErrorIfNotAllowed } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './password-reset-request.module.css'

const passwordResetRequestMutation = {
    resource: 'auth/forgotPassword',
    type: 'create',
    data: ({ emailOrUsername }) => ({ emailOrUsername }),
}

const InnerPasswordResetRequestForm = ({
    handleSubmit,
    formSubmitted,
    isRequired,
    uiLocale,
    loading,
}) => {
    const [params] = useSearchParams()

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <ReactFinalForm.Field
                    name="emailOrUsername"
                    label={i18n.t('Username or email', { lng: uiLocale })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={!formSubmitted ? null : isRequired}
                    key={formSubmitted ? 1 : 0}
                    initialFocus
                    readOnly={loading}
                    initialValue={params?.get('username') || ''}
                />
            </div>
            <div className={styles.formButtons}>
                <Button
                    type="submit"
                    disabled={loading}
                    className={styles.resetButton}
                    primary
                >
                    {loading
                        ? i18n.t('Sending...', { lng: uiLocale })
                        : i18n.t('Send password reset request form', {
                              lng: uiLocale,
                          })}
                </Button>
                <BackToLoginButton
                    fullWidth
                    buttonText={i18n.t('Cancel', { lng: uiLocale })}
                />
            </div>
        </form>
    )
}

InnerPasswordResetRequestForm.propTypes = {
    formSubmitted: PropTypes.bool,
    handleSubmit: PropTypes.func,
    isRequired: PropTypes.bool,
    loading: PropTypes.bool,
    uiLocale: PropTypes.string,
}

export const PasswordResetRequestForm = ({ uiLocale }) => {
    // depends on https://dhis2.atlassian.net/browse/DHIS2-14618
    const [resetPasswordRequest, { loading, fetching, error, data }] =
        useDataMutation(passwordResetRequestMutation)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const isRequired = getIsRequired(uiLocale)

    const handlePasswordResetRequest = (values) => {
        setFormSubmitted(true)
        const validationError = isRequired(values.emailOrUsername)
        if (validationError) {
            return
        }
        resetPasswordRequest({ emailOrUsername: values.emailOrUsername })
    }
    return (
        <>
            {error && (
                <FormNotice
                    title={i18n.t('Password reset failed', {
                        lng: uiLocale,
                    })}
                    error={true}
                >
                    <span>
                        {i18n.t(
                            'The username might be invalid, your account might not allow password reset, or there might be a problem with your account email address.',
                            { lng: uiLocale }
                        )}
                    </span>
                </FormNotice>
            )}
            {data && (
                <>
                    <FormNotice valid={true}>
                        <span>
                            {i18n.t(
                                "We've sent an email with a password reset link to your registered email address.",
                                { lng: uiLocale }
                            )}
                        </span>
                    </FormNotice>
                    <BackToLoginButton fullWidth />
                </>
            )}
            {!data && (
                <ReactFinalForm.Form onSubmit={handlePasswordResetRequest}>
                    {({ handleSubmit }) => (
                        <InnerPasswordResetRequestForm
                            handleSubmit={handleSubmit}
                            formSubmitted={formSubmitted}
                            isRequired={isRequired}
                            uiLocale={uiLocale}
                            loading={loading || fetching}
                        />
                    )}
                </ReactFinalForm.Form>
            )}
        </>
    )
}

PasswordResetRequestForm.defaultProps = {
    uiLocale: 'en',
}

PasswordResetRequestForm.propTypes = {
    uiLocale: PropTypes.string,
}

const requiredPropsForPasswordReset = [
    'allowAccountRecovery',
    'emailConfigured',
]

const PasswordResetRequestPage = () => {
    const { uiLocale } = useLoginConfig()
    const { notAllowed } = useGetErrorIfNotAllowed(
        requiredPropsForPasswordReset
    )

    if (notAllowed) {
        return <NotAllowedNotice uiLocale={uiLocale} />
    }

    return (
        <FormContainer title={i18n.t('Reset password', { lng: uiLocale })}>
            <FormSubtitle>
                <p>
                    {i18n.t(
                        'Enter your username below, a link to reset your password will be sent to your registered e-mail.',
                        { lng: uiLocale }
                    )}
                </p>
            </FormSubtitle>
            <PasswordResetRequestForm uiLocale={uiLocale} />
        </FormContainer>
    )
}

export default PasswordResetRequestPage
