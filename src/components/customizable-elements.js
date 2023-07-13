import { useLoginSettings } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'

export const ApplicationTitle = () => {
    const { applicationTitle } = useLoginSettings()
    return applicationTitle ? <span>{applicationTitle}</span> : null
}

export const ApplicationDescription = () => {
    const { applicationDescription } = useLoginSettings()
    return applicationDescription ? <span>{applicationDescription}</span> : null
}

export const Flag = () => {
    const { useCountryFlag, countryFlag } = useLoginSettings()
    return useCountryFlag && countryFlag ? (
        <img src={countryFlag} alt="flag" />
    ) : null
}

export const Logo = () => {
    const { useLoginPageLogo, loginPageLogo } = useLoginSettings()
    return useLoginPageLogo && loginPageLogo ? (
        <img src={loginPageLogo} alt="logo" />
    ) : null
}

export const ApplicationFooter = () => {
    const { applicationFooter } = useLoginSettings()
    return applicationFooter ? <span>{applicationFooter}</span> : null
}

export const PoweredByDHIS2 = () => {
    const { uiLocale } = useLoginSettings()
    return (
        <span>
            <bdi>
                <a
                    href="https://www.dhis2.org"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {i18n.t('Powered by DHIS2', { lng: uiLocale })}
                </a>
            </bdi>
        </span>
    )
}

export const LanguageSelect = () => {
    const { refreshOnTranslation, localesUI, uiLocale } = useLoginSettings()

    // stop app from erroring out if locales are missing
    // this will not be necessary in production, but here for development purposes
    if (!localesUI.map((l) => l.locale).includes('en')) {
        return null
    }

    return (
        <SingleSelectField
            dense
            prefix="Language"
            selected={
                localesUI.map((l) => l.locale).includes(uiLocale)
                    ? uiLocale
                    : 'en'
            }
            onChange={({ selected }) => {
                refreshOnTranslation({ locale: selected })
            }}
        >
            {localesUI &&
                localesUI.map((locale) => (
                    <SingleSelectOption
                        key={locale.locale}
                        value={locale.locale}
                        label={
                            locale.name === locale.displayName
                                ? locale.name
                                : `${locale.name} – ${locale.displayName}`
                        }
                    />
                ))}
        </SingleSelectField>
    )
}
