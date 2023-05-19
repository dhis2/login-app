import { useDataQuery, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/loader.js'
import { LoginConfigContext } from './login-config-context.js'

const query = {
    loginConfig: {
        // This is generic enpoint but will only return
        // exchanges a user is allowed to see
        resource: 'auth/loginConfig',
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
        // This is generic enpoint but will only return
        // exchanges a user is allowed to see
        resource: 'auth/loginConfig',
        params: ({ locale }) => ({
            paging: false,
            locale,
        }),
    },
}

const translatableValues = [
    'applicationDescription',
    'applicationFooter',
    'applicationNotification',
    'applicationTitle',
]

// defaults for testing while endpoints are in development

const defaultProviderValues = {
    applicationDescription:
        'This is the long application subtitle where there is a lot of information included in the subtitle so it must handle this much information',
    applicationFooter: 'Application left side footer text',
    applicationNotification:
        'this is placeholder for the application notification.',
    allowAccountRecovery: true,
    applicationTitle: 'Example application title that could be very long',
    countryFlag: 'http://localhost:8080/dhis-web-commons/flags/norway.png',
    useCountryFlag: true,
    loginPageLogo: 'http://localhost:8080/api/staticContent/logo_front',
    useLoginPageLogo: true,
    emailConfigured: true,
    selfRegistrationEnabled: true,
    selfRegistrationNoRecaptcha: false,
    systemUiLocale: 'en',
    uiLocale: 'en',
    isRTL: false,
    htmlTemplate: 'custom',
}

const defaultLocales = [
    { locale: 'ar', name: 'عربي (Arabic)' },
    { locale: 'zh', name: 'Chinese' },
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'French' },
    { locale: 'nb', name: 'Norwegian' },
    { locale: 'es', name: 'Spanish' },
]

const sampleTranslations = {
    fr: {
        applicationTitle:
            "Example d'un titre d'applis qui pourrait être très long",
    },
    nb: {
        applicationTitle:
            'Eksempel på en applikasjonstittel som kunne være veldig lang',
        applicationDescription:
            'Dette er den lange applikasjonsundertittelen som inneholder veldig mye informasjon slik at appen må kunne håndtere sånne innholdslengder',
    },
}

//

const LoginConfigProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(query, {
        variables: { locale: localStorage[localStorageLocaleKey] },
    })

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
            updatedValues = sampleTranslations[locale] ?? {}
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
        ...defaultProviderValues,
        ...data?.loginConfig,
        ...translatedValues,
        localesUI: data?.localesUI || defaultLocales,
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
