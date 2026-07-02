import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { FormNotice } from '../../components/index.js'

export const LoginErrors = ({
    lngs = ['en'],
    error,
    twoFAIncorrect,
    passwordExpired,
    passwordResetEnabled,
    accountInaccessible,
    unknownStatus,
    emailTwoFAIncorrect,
    isResetButtonPressed,
    twoFACodeRequired,
    twoFAVerificationRequired,
    formUserName,
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

    if (
        twoFACodeRequired &&
        twoFAVerificationRequired &&
        !isResetButtonPressed
    ) {
        return (
            <FormNotice
                title={i18n.t('Authentication code is required', { lngs })}
                error
            />
        )
    }

    if (twoFAIncorrect) {
        return (
            <FormNotice
                title={i18n.t('Incorrect authentication code', { lngs })}
                error
            />
        )
    }
    if (emailTwoFAIncorrect && !isResetButtonPressed) {
        return (
            <FormNotice
                title={i18n.t('Incorrect authentication code', { lngs })}
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
                <div>
                    <Link
                        to={
                            formUserName
                                ? `/change-expired-password?username=${encodeURIComponent(
                                      formUserName
                                  )}`
                                : '/change-expired-password'
                        }
                    >
                        {i18n.t('Change your expired password', { lngs })}
                    </Link>
                </div>
                {passwordResetEnabled && (
                    <div>
                        <Link to="/reset-password">
                            {i18n.t(
                                'You can reset your password from the password reset page.'
                            )}
                        </Link>
                    </div>
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
    emailTwoFAIncorrect: PropTypes.bool,
    error: PropTypes.object,
    formUserName: PropTypes.string,
    isResetButtonPressed: PropTypes.bool,
    lngs: PropTypes.arrayOf(PropTypes.string),
    passwordExpired: PropTypes.bool,
    passwordResetEnabled: PropTypes.bool,
    twoFACodeRequired: PropTypes.bool,
    twoFAIncorrect: PropTypes.bool,
    twoFAVerificationRequired: PropTypes.bool,
    unknownStatus: PropTypes.bool,
}
