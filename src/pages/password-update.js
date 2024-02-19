import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ReactFinalForm, InputFieldFF } from '@dhis2/ui'
import { composeValidators, dhis2Password } from '@dhis2/ui-forms'
import PropTypes from 'prop-types'
import React from 'react'
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
import styles from './password-update.module.css'

const passwordUpdateMutation = {
    resource: 'auth/passwordReset',
    type: 'create',
    data: (data) => ({ ...data }),
}

const InnerPasswordUpdateForm = ({ handleSubmit, uiLocale, loading }) => {
    const isRequired = getIsRequired(uiLocale)

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <ReactFinalForm.Field
                    name="password"
                    type="password"
                    label={i18n.t('Password', { lng: uiLocale })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={composeValidators(isRequired, dhis2Password)}
                    initialFocus
                    readOnly={loading}
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
                        ? i18n.t('Saving...', { lng: uiLocale })
                        : i18n.t('Save new password', {
                              lng: uiLocale,
                          })}
                </Button>
                <BackToLoginButton
                    buttonText={i18n.t('Cancel', { lng: uiLocale })}
                />
            </div>
        </form>
    )
}

InnerPasswordUpdateForm.propTypes = {
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    uiLocale: PropTypes.string,
}

export const PasswordUpdateForm = ({ token, uiLocale }) => {
    // depends on https://dhis2.atlassian.net/browse/DHIS2-14618
    const [updatePassword, { loading, fetching, error, data }] =
        useDataMutation(passwordUpdateMutation)

    const handlePasswordUpdate = (values) => {
        updatePassword({ newPassword: values.password, token })
    }
    return (
        <>
            <div>
                <div>
                    {error && (
                        <FormNotice
                            title={i18n.t('New password not saved', {
                                lng: uiLocale,
                            })}
                            error={true}
                        >
                            <span>
                                {i18n.t(
                                    'There was a problem saving your password. Try again or contact your system administrator.',
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
                                        'New password saved. You can use it to log in to your account.',
                                        { lng: uiLocale }
                                    )}
                                </span>
                            </FormNotice>
                            <BackToLoginButton fullWidth />
                        </>
                    )}
                    {!data && (
                        <ReactFinalForm.Form onSubmit={handlePasswordUpdate}>
                            {({ handleSubmit }) => (
                                <InnerPasswordUpdateForm
                                    handleSubmit={handleSubmit}
                                    uiLocale={uiLocale}
                                    loading={loading || fetching}
                                />
                            )}
                        </ReactFinalForm.Form>
                    )}
                </div>
            </div>
        </>
    )
}

PasswordUpdateForm.defaultProps = {
    uiLocale: 'en',
}

PasswordUpdateForm.propTypes = {
    token: PropTypes.string,
    uiLocale: PropTypes.string,
}

// presumably these would need to be allowed
const requiredPropsForPasswordReset = [
    'allowAccountRecovery',
    'emailConfigured',
]

const PasswordUpdatePage = () => {
    const { uiLocale } = useLoginConfig()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''
    // display error if token is invalid?
    const { notAllowed } = useGetErrorIfNotAllowed(
        requiredPropsForPasswordReset
    )

    if (notAllowed) {
        return <NotAllowedNotice uiLocale={uiLocale} />
    }

    return (
        <FormContainer
            width="368px"
            title={i18n.t('Choose new password', { lng: uiLocale })}
        >
            <FormSubtitle>
                <p>
                    {i18n.t('Enter the new password for your account below', {
                        lng: uiLocale,
                    })}
                </p>
            </FormSubtitle>
            <PasswordUpdateForm uiLocale={uiLocale} token={token} />
        </FormContainer>
    )
}

export default PasswordUpdatePage
