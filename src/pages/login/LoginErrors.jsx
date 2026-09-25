import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormNotice } from '../../components/index.js'

const ContactSysAdminNotice = ({
    accountDisabled,
    accountLocked,
    accountExpired,
    lngs,
}) => {
    let title = i18n.t('Something went wrong', { lngs })
    if (accountDisabled) {
        title = i18n.t('Your account has been disabled', { lngs })
    }
    if (accountLocked) {
        title = i18n.t('Your account is temporarily locked', { lngs })
    }
    if (accountExpired) {
        title = i18n.t('Your account has expired', { lngs })
    }

    return (
        <FormNotice title={title} error>
            {i18n.t('Contact your system administrator.', { lngs })}
        </FormNotice>
    )
}

ContactSysAdminNotice.propTypes = {
    accountDisabled: PropTypes.bool,
    accountExpired: PropTypes.bool,
    accountLocked: PropTypes.bool,
    lngs: PropTypes.arrayOf(PropTypes.string),
}

export const LoginErrors = ({
    lngs = ['en'],
    error,
    twoFAIncorrect,
    accountDisabled,
    accountLocked,
    accountExpired,
    unknownStatus,
    emailTwoFAIncorrect,
    isResetButtonPressed,
    twoFACodeRequired,
    twoFAVerificationRequired,
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

    if (accountDisabled || accountLocked || accountExpired || unknownStatus) {
        return (
            <ContactSysAdminNotice
                accountDisabled={accountDisabled}
                accountLocked={accountLocked}
                accountExpired={accountExpired}
                lngs={lngs}
            />
        )
    }
    return null
}

LoginErrors.propTypes = {
    accountDisabled: PropTypes.bool,
    accountExpired: PropTypes.bool,
    accountLocked: PropTypes.bool,
    emailTwoFAIncorrect: PropTypes.bool,
    error: PropTypes.object,
    isResetButtonPressed: PropTypes.bool,
    lngs: PropTypes.arrayOf(PropTypes.string),
    twoFACodeRequired: PropTypes.bool,
    twoFAIncorrect: PropTypes.bool,
    twoFAVerificationRequired: PropTypes.bool,
    unknownStatus: PropTypes.bool,
}
