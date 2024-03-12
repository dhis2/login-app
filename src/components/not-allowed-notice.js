import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { BackToLoginButton } from './back-to-login-button.js'
import { FormContainer } from './form-container.js'
import { FormNotice } from './form-notice.js'

export const NotAllowedNotice = ({ uiLocale }) => (
    <FormContainer>
        <FormNotice error>
            <span>
                {i18n.t(
                    'The requested page is not configured for your system',
                    { lng: uiLocale }
                )}
            </span>
        </FormNotice>
        <BackToLoginButton />
    </FormContainer>
)

NotAllowedNotice.propTypes = {
    uiLocale: PropTypes.string,
}

export const NotAllowedNoticeCreateAccount = ({ uiLocale }) => (
    <FormContainer>
        <FormNotice
            error
            title={i18n.t('Creating account not available', { lng: uiLocale })}
        >
            <span>
                {i18n.t(
                    'Contact a system administrator to create an account.',
                    { lng: uiLocale }
                )}
            </span>
        </FormNotice>
        <BackToLoginButton />
    </FormContainer>
)

NotAllowedNoticeCreateAccount.propTypes = {
    uiLocale: PropTypes.string,
}
