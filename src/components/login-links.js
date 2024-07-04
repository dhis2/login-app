import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { useLoginConfig } from '../providers/index.js'
import styles from './login-links.module.css'

export const LoginLinks = ({ formUserName }) => {
    const {
        allowAccountRecovery,
        emailConfigured,
        selfRegistrationEnabled,
        lngs,
    } = useLoginConfig()

    return (
        <>
            <div className={styles.links}>
                {allowAccountRecovery && emailConfigured && (
                    <span>
                        <Link
                            to={
                                formUserName
                                    ? `/reset-password?username=${formUserName}`
                                    : `/reset-password`
                            }
                        >
                            {i18n.t('Forgot password?', { lngs })}
                        </Link>
                    </span>
                )}
                {selfRegistrationEnabled && (
                    <span>
                        {i18n.t("Don't have an account?", { lngs })}{' '}
                        <Link to="/create-account">
                            {i18n.t('Create an account', { lngs })}
                        </Link>
                    </span>
                )}
            </div>
        </>
    )
}

LoginLinks.propTypes = {
    formUserName: PropTypes.string,
}
