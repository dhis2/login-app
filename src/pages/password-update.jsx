import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ReactFinalForm, InputFieldFF, dhis2Password } from '@dhis2/ui'
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
import {
    getIsRequired,
    composeAndTranslateValidators,
    getPasswordValidator,
} from '../helpers/index.js'
import { useGetErrorIfNotAllowed, useFeatureToggle } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './password-update.module.css'

const passwordUpdateMutation = {
    resource: 'auth/passwordReset',
    type: 'create',
    data: (data) => ({ ...data }),
}

const InnerPasswordUpdateForm = ({ handleSubmit, lngs, loading }) => {
    const { validatePasswordWithRegex } = useFeatureToggle()
    const { minPasswordLength, maxPasswordLength } = useLoginConfig()
    const passwordRegExValidator = getPasswordValidator({
        minPasswordLength,
        maxPasswordLength,
    })

    const isRequired = getIsRequired(lngs?.[0])

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <ReactFinalForm.Field
                    name="password"
                    type="password"
                    label={i18n.t('Password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={composeAndTranslateValidators(
                        isRequired,
                        validatePasswordWithRegex
                            ? passwordRegExValidator
                            : dhis2Password
                    )}
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
                        ? i18n.t('Saving...', { lngs })
                        : i18n.t('Save new password', {
                              lngs,
                          })}
                </Button>
                <BackToLoginButton buttonText={i18n.t('Cancel', { lngs })} />
            </div>
        </form>
    )
}

InnerPasswordUpdateForm.propTypes = {
    handleSubmit: PropTypes.func,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
}

const defaultLngs = ['en']
export const PasswordUpdateForm = ({ token, lngs = defaultLngs }) => {
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
                                lngs,
                            })}
                            error={true}
                        >
                            <span>
                                {i18n.t(
                                    'There was a problem saving your password. Try again or contact your system administrator.',
                                    { lngs }
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
                                        { lngs }
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
                                    lngs={lngs}
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

PasswordUpdateForm.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
    token: PropTypes.string,
}

// presumably these would need to be allowed
const requiredPropsForPasswordReset = [
    'allowAccountRecovery',
    'emailConfigured',
]

const PasswordUpdatePage = () => {
    const { lngs } = useLoginConfig()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''
    // display error if token is invalid?
    const { notAllowed } = useGetErrorIfNotAllowed(
        requiredPropsForPasswordReset
    )

    if (notAllowed) {
        return <NotAllowedNotice lngs={lngs} />
    }

    return (
        <FormContainer title={i18n.t('Choose new password', { lngs })}>
            <FormSubtitle>
                <p>
                    {i18n.t('Enter the new password for your account below', {
                        lngs,
                    })}
                </p>
            </FormSubtitle>
            <PasswordUpdateForm lngs={lngs} token={token} />
        </FormContainer>
    )
}

export default PasswordUpdatePage
