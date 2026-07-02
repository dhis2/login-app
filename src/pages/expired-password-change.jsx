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
} from '../components/index.js'
import {
    getIsRequired,
    composeAndTranslateValidators,
    getPasswordValidator,
} from '../helpers/index.js'
import { useFeatureToggle } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './expired-password-change.module.css'

// POSTs to the JSON auth/* endpoint added in dhis2-core for DHIS2-21120. The account is
// un-expired by a successful change, so the user then logs in again via the normal login form.
const updateExpiredPasswordMutation = {
    resource: 'auth/updatePassword',
    type: 'create',
    data: ({ username, oldPassword, newPassword }) => ({
        username,
        oldPassword,
        newPassword,
    }),
}

const InnerExpiredPasswordChangeForm = ({
    handleSubmit,
    lngs,
    loading,
    username,
}) => {
    const { validatePasswordWithRegex } = useFeatureToggle()
    const { minPasswordLength, maxPasswordLength } = useLoginConfig()
    const passwordRegExValidator = getPasswordValidator({
        minPasswordLength,
        maxPasswordLength,
    })
    const isRequired = getIsRequired(lngs?.[0])

    const validateConfirmPassword = (value, allValues) => {
        if (!value) {
            return i18n.t('This field is required', { lng: lngs?.[0] })
        }
        if (value !== allValues?.password) {
            return i18n.t('Passwords do not match', { lng: lngs?.[0] })
        }
        return undefined
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <ReactFinalForm.Field
                    name="username"
                    label={i18n.t('Username', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={isRequired}
                    initialValue={username}
                    readOnly={loading || Boolean(username)}
                    initialFocus={!username}
                />
                <ReactFinalForm.Field
                    name="oldPassword"
                    type="password"
                    label={i18n.t('Current password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={isRequired}
                    readOnly={loading}
                    initialFocus={Boolean(username)}
                />
                <ReactFinalForm.Field
                    name="password"
                    type="password"
                    label={i18n.t('New password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={composeAndTranslateValidators(
                        isRequired,
                        validatePasswordWithRegex
                            ? passwordRegExValidator
                            : dhis2Password
                    )}
                    readOnly={loading}
                />
                <ReactFinalForm.Field
                    name="confirmPassword"
                    type="password"
                    label={i18n.t('Confirm new password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={validateConfirmPassword}
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
                        : i18n.t('Save new password', { lngs })}
                </Button>
                <BackToLoginButton buttonText={i18n.t('Cancel', { lngs })} />
            </div>
        </form>
    )
}

InnerExpiredPasswordChangeForm.propTypes = {
    handleSubmit: PropTypes.func,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    username: PropTypes.string,
}

const defaultLngs = ['en']
export const ExpiredPasswordChangeForm = ({
    username = '',
    lngs = defaultLngs,
}) => {
    const [updatePassword, { loading, fetching, error, data }] =
        useDataMutation(updateExpiredPasswordMutation)

    const handleUpdate = (values) => {
        updatePassword({
            username: values.username,
            oldPassword: values.oldPassword,
            newPassword: values.password,
        })
    }

    return (
        <div>
            {error && (
                <FormNotice
                    title={i18n.t('Could not update password', { lngs })}
                    error={true}
                >
                    <span>
                        {error?.details?.message ||
                            i18n.t(
                                'Try again, or contact your system administrator if the problem persists.',
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
                                'Your password has been updated. You can now log in with your new password.',
                                { lngs }
                            )}
                        </span>
                    </FormNotice>
                    <BackToLoginButton fullWidth />
                </>
            )}
            {!data && (
                <ReactFinalForm.Form onSubmit={handleUpdate}>
                    {({ handleSubmit }) => (
                        <InnerExpiredPasswordChangeForm
                            handleSubmit={handleSubmit}
                            lngs={lngs}
                            loading={loading || fetching}
                            username={username}
                        />
                    )}
                </ReactFinalForm.Form>
            )}
        </div>
    )
}

ExpiredPasswordChangeForm.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
    username: PropTypes.string,
}

// Deliberately NOT gated by allowAccountRecovery / emailConfigured: the whole point of this
// flow is that an expired user can self-serve a new password without an email server (DHIS2-21120).
const ExpiredPasswordChangePage = () => {
    const { lngs } = useLoginConfig()
    const [searchParams] = useSearchParams()
    const username = searchParams.get('username') || ''

    return (
        <FormContainer title={i18n.t('Change expired password', { lngs })}>
            <FormSubtitle>
                <p>
                    {i18n.t(
                        'Your password has expired. Enter your current password and choose a new one to continue.',
                        { lngs }
                    )}
                </p>
            </FormSubtitle>
            <ExpiredPasswordChangeForm lngs={lngs} username={username} />
        </FormContainer>
    )
}

export default ExpiredPasswordChangePage
