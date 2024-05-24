import { useDataQuery, useDataEngine, useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/loader.js'
import { LoginConfigContext } from './login-config-context.js'

const localStorageLocaleKey = 'dhis2.locale.ui'

const loginConfigQuery = {
    loginConfig: {
        resource: 'loginConfig',
        params: ({ locale }) => ({
            paging: false,
            locale,
        }),
    },
}

const localesQuery = {
    localesUI: {
        resource: 'locales/ui',
    },
}

const translatableValues = [
    'applicationDescription',
    'applicationLeftSideFooter',
    'applicationRightSideFooter',
    'applicationNotification',
    'applicationTitle',
]

// defaults in case locales/ui fails
const defaultLocales = [
    { locale: 'ar', displayName: 'Arabic', name: 'العربية' },
    { locale: 'en', displayName: 'English', name: 'English' },
    { locale: 'fr', displayName: 'French', name: 'français' },
    { locale: 'pt', displayName: 'Portuguese', name: 'português' },
    { locale: 'es', displayName: 'Spanish', name: 'español' },
]

const LoginConfigProvider = ({ children }) => {
    const {
        data: loginConfigData,
        loading: loginConfigLoading,
        error: loginConfigError,
    } = useDataQuery(loginConfigQuery, {
        variables: { locale: localStorage.getItem(localStorageLocaleKey) },
    })
    const {
        data: localesData,
        loading: localesLoading,
        error: localesError,
    } = useDataQuery(localesQuery)
    const config = useConfig()

    const [translatedValues, setTranslatedValues] = useState()

    useEffect(() => {
        // if there is a stored language, set it as i18next language
        const userLanguage =
            localStorage.getItem(localStorageLocaleKey) ||
            loginConfigData?.loginConfig?.uiLocale ||
            'en'
        setTranslatedValues({ uiLocale: userLanguage })
        i18n.changeLanguage(userLanguage)
        document.documentElement.setAttribute('dir', i18n.dir())
    }, []) //eslint-disable-line

    const engine = useDataEngine()

    const refreshOnTranslation = async ({ locale }) => {
        if (!engine) {
            return
        }
        let updatedValues
        try {
            updatedValues = await engine.query(loginConfigQuery, {
                variables: { locale },
            })
        } catch (e) {
            console.error(e)
        }
        i18n.changeLanguage(locale)
        document.documentElement.setAttribute('dir', i18n.dir())
        // the logic here is wrong as it falls back to previous translations (rather than defaults)
        // however, the api response will fall back to default system language (so this doesn't cause issues)
        const updatedTranslations = translatableValues.reduce(
            (translations, currentTranslationKey) => {
                if (updatedValues?.loginConfig?.[currentTranslationKey]) {
                    translations[currentTranslationKey] =
                        updatedValues?.loginConfig?.[currentTranslationKey]
                }

                return translations
            },
            {}
        )
        setTranslatedValues({ ...updatedTranslations, uiLocale: locale }),
            localStorage.setItem(localStorageLocaleKey, locale)
    }

    if (loginConfigLoading || localesLoading) {
        return <Loader />
    }

    // the app will function without the appearance settings, so just console error
    if (loginConfigError) {
        console.error(loginConfigError)
    }

    if (localesError) {
        console.error(localesError)
    }

    const providerValue = {
        ...loginConfigData?.loginConfig,
        ...translatedValues,
        localesUI: localesData?.localesUI ?? defaultLocales,
        systemLocale: loginConfigData?.loginConfig?.uiLocale ?? 'en',
        baseUrl: config?.baseUrl,
        refreshOnTranslation,
    }

    return (
        <LoginConfigContext.Provider value={providerValue}>
            <div dir={i18n.dir()}>{children}</div>
        </LoginConfigContext.Provider>
    )
}

LoginConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { LoginConfigProvider }
