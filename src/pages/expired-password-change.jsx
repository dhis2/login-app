import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ReactFinalForm, InputFieldFF } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    BackToLoginButton,
    FormContainer,
    FormSubtitle,
    MutationFormShell,
} from '../components/index.js'
import {
    getIsRequired,
    composeAndTranslateValidators,
    passwordsMatch,
} from '../helpers/index.js'
import { useNewPasswordValidator } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './password-form.module.css'

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
    const newPasswordValidator = useNewPasswordValidator()
    const isRequired = getIsRequired(lngs?.[0])

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
                    name="newPassword"
                    type="password"
                    label={i18n.t('New password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={composeAndTranslateValidators(
                        isRequired,
                        newPasswordValidator
                    )}
                    readOnly={loading}
                />
                <ReactFinalForm.Field
                    name="confirmPassword"
                    type="password"
                    label={i18n.t('Confirm new password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={composeAndTranslateValidators(
                        isRequired,
                        passwordsMatch
                    )}
                    readOnly={loading}
                />
            </div>
            <div className={styles.formButtons}>
                <Button
                    type="submit"
                    disabled={loading}
                    className={styles.submitButton}
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

    // The mutation's data function picks the three wire fields (and drops confirmPassword),
    // so no second mapping layer is needed here. Do NOT return the promise: app-runtime
    // resolves a failed mutation to a promise that never settles, and react-final-form would
    // then keep submitting=true forever, silently blocking every retry after an error.
    const handleUpdate = (values) => {
        updatePassword(values)
    }

    return (
        <MutationFormShell
            error={error}
            errorTitle={i18n.t('Could not update password', { lngs })}
            // Surfaces the server message verbatim. Unlike password-update's fixed generic
            // string, these backend messages ("Account is not expired", "Invalid username
            // or password", the password-policy text) are deliberately specific and
            // enumeration-safe, so we show them directly rather than through app i18n.
            errorMessage={
                error?.details?.message ||
                i18n.t(
                    'Try again, or contact your system administrator if the problem persists.',
                    { lngs }
                )
            }
            data={data}
            successMessage={i18n.t(
                'Your password has been updated. You can now log in with your new password.',
                { lngs }
            )}
            onSubmit={handleUpdate}
        >
            {({ handleSubmit }) => (
                <InnerExpiredPasswordChangeForm
                    handleSubmit={handleSubmit}
                    lngs={lngs}
                    loading={loading || fetching}
                    username={username}
                />
            )}
        </MutationFormShell>
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
