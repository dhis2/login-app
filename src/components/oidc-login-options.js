import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useLoginConfig } from '../providers/index.js'
import styles from './oidc-login-options.module.css'

const loginTextStrings = {
    login_with_google: i18n.t('Log in with Google'),
    login_with_azure: i18n.t('Log in with Microsoft'),
}

const SVGIcon = ({ baseUrl, endpoint }) => (
    <div>
        <img height="30px" width="30px" src={`${baseUrl}${endpoint}`} />
    </div>
)

SVGIcon.propTypes = {
    baseUrl: PropTypes.string,
    endpoint: PropTypes.string,
}

const redirectToOIDC = ({ baseUrl, endpoint }) => {
    window.location.href = `${baseUrl}${endpoint}`
}

export const OIDCLoginOptions = () => {
    const { oidcProviders, baseUrl, uiLocale } = useLoginConfig()
    if (!(oidcProviders?.length > 0)) {
        return null
    }
    return (
        <div className={styles.formButtons}>
            {oidcProviders.map((oidc) => (
                <Button
                    icon={<SVGIcon baseUrl={baseUrl} endpoint={oidc?.icon} />}
                    key={oidc?.id}
                    onClick={() => {
                        redirectToOIDC({ baseUrl, endpoint: oidc?.url })
                    }}
                >
                    {loginTextStrings[oidc?.loginText]
                        ? i18n.t(loginTextStrings[oidc.loginText], {
                              lng: uiLocale,
                          })
                        : oidc?.loginText}
                </Button>
            ))}
        </div>
    )
}
