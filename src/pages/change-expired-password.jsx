import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ReactFinalForm, InputFieldFF, dhis2Password } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
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
    passwordsMatch,
} from '../helpers/index.js'
import { useFeatureToggle } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './change-expired-password.module.css'

const updateExpiredPasswordMutation = {
    resource: 'auth/updatePassword',
    type: 'create',
    data: ({ username, oldPassword, newPassword }) => ({
        username,
        oldPassword,
        newPassword,
    }),
}

const InnerChangeExpiredPasswordForm = ({
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
                    autoComplete="username"
                    readOnly={loading}
                    initialFocus={!username}
                />
                <ReactFinalForm.Field
                    name="oldPassword"
                    type="password"
                    label={i18n.t('Current password', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={isRequired}
                    autoComplete="current-password"
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
                        validatePasswordWithRegex
                            ? passwordRegExValidator
                            : dhis2Password
                    )}
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
                <BackToLoginButton
                    fullWidth
                    buttonText={i18n.t('Cancel', { lngs })}
                />
            </div>
        </form>
    )
}

InnerChangeExpiredPasswordForm.propTypes = {
    handleSubmit: PropTypes.func,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    username: PropTypes.string,
}

const defaultLngs = ['en']

export const ChangeExpiredPasswordForm = ({
    username = '',
    lngs = defaultLngs,
    onSuccess,
}) => {
    const [updatePassword, { loading, fetching, error, data }] =
        useDataMutation(updateExpiredPasswordMutation, {
            onComplete: onSuccess,
        })

    const handleChangeExpiredPassword = (values) => {
        updatePassword(values)
    }

    return (
        <>
            {error && (
                <FormNotice
                    title={i18n.t('Could not update password', { lngs })}
                    error
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
                    <FormNotice valid>
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
                <ReactFinalForm.Form onSubmit={handleChangeExpiredPassword}>
                    {({ handleSubmit }) => (
                        <InnerChangeExpiredPasswordForm
                            handleSubmit={handleSubmit}
                            lngs={lngs}
                            loading={loading || fetching}
                            username={username}
                        />
                    )}
                </ReactFinalForm.Form>
            )}
        </>
    )
}

ChangeExpiredPasswordForm.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
    username: PropTypes.string,
    onSuccess: PropTypes.func,
}

const ChangeExpiredPasswordPage = () => {
    const { lngs } = useLoginConfig()
    const [searchParams] = useSearchParams()
    const username = searchParams.get('username') || ''
    const [passwordUpdated, setPasswordUpdated] = useState(false)

    return (
        <FormContainer
            title={
                passwordUpdated
                    ? i18n.t('Password updated', { lngs })
                    : i18n.t('Password expired', { lngs })
            }
        >
            {!passwordUpdated && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'Your password has expired. Enter your current password and choose a new one to continue.',
                            { lngs }
                        )}
                    </p>
                </FormSubtitle>
            )}
            <ChangeExpiredPasswordForm
                username={username}
                lngs={lngs}
                onSuccess={() => setPasswordUpdated(true)}
            />
        </FormContainer>
    )
}

export default ChangeExpiredPasswordPage
