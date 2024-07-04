import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { BackToLoginButton } from './back-to-login-button.js'
import { FormContainer } from './form-container.js'
import { FormNotice } from './form-notice.js'

export const NotAllowedNotice = ({ lngs }) => (
    <FormContainer>
        <FormNotice error>
            <span>
                {i18n.t(
                    'The requested page is not configured for your system',
                    { lngs }
                )}
            </span>
        </FormNotice>
        <BackToLoginButton />
    </FormContainer>
)

NotAllowedNotice.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
}

export const NotAllowedNoticeCreateAccount = ({ lngs }) => (
    <FormContainer>
        <FormNotice
            error
            title={i18n.t('Creating account not available', { lngs })}
        >
            <span>
                {i18n.t(
                    'Contact a system administrator to create an account.',
                    { lngs }
                )}
            </span>
        </FormNotice>
        <BackToLoginButton />
    </FormContainer>
)

NotAllowedNoticeCreateAccount.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
}
