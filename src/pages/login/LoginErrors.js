import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { FormNotice } from '../../components/index.js'

export const LoginErrors = ({
    lngs,
    error,
    twoFAIncorrect,
    passwordExpired,
    passwordResetEnabled,
    accountInaccessible,
    unknownStatus,
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

    if (twoFAIncorrect) {
        return (
            <FormNotice
                title={i18n.t('Incorrect authentication code', {
                    lngs,
                })}
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
                {passwordResetEnabled ? (
                    <Link to="/reset-password">
                        {i18n.t(
                            'You can reset your password from the password reset page.'
                        )}
                    </Link>
                ) : (
                    i18n.t('Contact your system administrator.')
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
    error: PropTypes.object,
    lngs: PropTypes.arrayOf(PropTypes.string),
    passwordExpired: PropTypes.bool,
    passwordResetEnabled: PropTypes.bool,
    twoFAIncorrect: PropTypes.bool,
    unknownStatus: PropTypes.bool,
}
