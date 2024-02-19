import { useDataQuery, useDataEngine, useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/loader.js'
import { LoginConfigContext } from './login-config-context.js'

const query = {
    loginConfig: {
        resource: 'loginConfig',
        params: ({ locale }) =>
            locale
                ? {
                      paging: false,
                      locale,
                  }
                : {
                      paging: false,
                  },
    },
    localesUI: {
        resource: 'locales/ui',
    },
}

const localStorageLocaleKey = 'dhis2.locale.ui'

const translationsQuery = {
    loginConfig: {
        resource: 'loginConfig',
        params: ({ locale }) => ({
            paging: false,
            locale,
        }),
    },
}

const translatableValues = [
    'applicationDescription',
    'applicationLeftSideFooter',
    'applicationRightSideFooter',
    'applicationNotification',
    'applicationTitle',
]

// defaults for testing while endpoints are in development

const defaultLocales = [
    { locale: 'ar', name: 'عربي (Arabic)' },
    { locale: 'zh', name: 'Chinese' },
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'French' },
    { locale: 'nb', name: 'Norwegian' },
    { locale: 'es', name: 'Spanish' },
]

const LoginConfigProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(query, {
        variables: { locale: localStorage[localStorageLocaleKey] },
    })
    const config = useConfig()

    const [translatedValues, setTranslatedValues] = useState()

    useEffect(() => {
        // if there is a stored language, set it as i18next language
        const userLanguage =
            localStorage[localStorageLocaleKey] ||
            data?.loginConfig?.uiLocale ||
            'en'
        setTranslatedValues({ uiLocale: userLanguage })
        i18n.changeLanguage(userLanguage)
    }, []) //eslint-disable-line

    const engine = useDataEngine()

    const refreshOnTranslation = async ({ locale }) => {
        if (!engine) {
            return
        }
        let updatedValues
        try {
            updatedValues = await engine.query(translationsQuery, {
                variables: { locale },
            })
        } catch (e) {
            console.error(e)
        }
        i18n.changeLanguage(locale)
        const updatedTranslations = translatableValues.reduce(
            (translations, currentTranslationKey) => {
                if (updatedValues[currentTranslationKey]) {
                    translations[currentTranslationKey] =
                        updatedValues[currentTranslationKey]
                }

                return translations
            },
            {}
        )
        setTranslatedValues({ ...updatedTranslations, uiLocale: locale })
        localStorage.setItem(localStorageLocaleKey, locale)
    }

    if (loading) {
        return <Loader />
    }

    if (error) {
        /**
         * provide an error boundary? or proceed with non-custom login page?
         */
    }

    const providerValue = {
        // ...defaultProviderValues,
        ...data?.loginConfig,
        ...translatedValues,
        localesUI: data?.localesUI ?? defaultLocales,
        countryFlag:
            'http://localhost:8080/dhis-web-commons/flags/sierra_leone.png',
        baseUrl: config?.baseUrl,
        isRTL: i18n.dir() === 'rtl',
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
