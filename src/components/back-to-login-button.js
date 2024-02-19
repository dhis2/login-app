import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { useLoginConfig } from '../providers/index.js'
import styles from './back-to-login-button.module.css'

export const BackToLoginButton = ({ fullWidth, buttonText }) => {
    const { uiLocale } = useLoginConfig()
    return (
        <>
            <Link to="/">
                <Button
                    secondary
                    className={fullWidth ? styles.fullWidth : null}
                >
                    {buttonText ??
                        i18n.t('Back to log in page', { lng: uiLocale })}
                </Button>
            </Link>
        </>
    )
}

BackToLoginButton.propTypes = {
    buttonText: PropTypes.string,
    fullWidth: PropTypes.bool,
}
