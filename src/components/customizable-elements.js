import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { convertHTML } from '../helpers/index.js'
import { useLoginConfig } from '../providers/index.js'
import { DHIS2Logo } from './dhis2-logo.js'

export const ApplicationTitle = () => {
    const { applicationTitle } = useLoginConfig()
    return applicationTitle ? (
        <span>{convertHTML(applicationTitle)}</span>
    ) : null
}

export const ApplicationDescription = () => {
    const { applicationDescription } = useLoginConfig()
    return applicationDescription ? (
        <span>{convertHTML(applicationDescription)}</span>
    ) : null
}

export const Flag = () => {
    const { countryFlag } = useLoginConfig()
    const { baseUrl } = useConfig()

    return countryFlag ? (
        <img
            src={`${baseUrl}/dhis-web-commons/flags/${countryFlag}.png`}
            alt="flag"
        />
    ) : null
}

export const Logo = () => {
    const { loginPageLayout, loginPageLogo } = useLoginConfig()
    const { baseUrl } = useConfig()

    if (!loginPageLogo && loginPageLayout === 'SIDEBAR') {
        return <DHIS2Logo />
    }

    return (
        <img src={`${baseUrl}/api/staticContent/logo_front.png`} alt="logo" />
    )
}

export const ApplicationLeftFooter = () => {
    const { applicationLeftSideFooter } = useLoginConfig()
    return applicationLeftSideFooter ? (
        <span>{convertHTML(applicationLeftSideFooter)}</span>
    ) : null
}

export const ApplicationRightFooter = () => {
    const { applicationRightSideFooter } = useLoginConfig()
    return applicationRightSideFooter ? (
        <span>{convertHTML(applicationRightSideFooter)}</span>
    ) : null
}

export const PoweredByDHIS2 = () => {
    const { uiLocale } = useLoginConfig()
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
    const { refreshOnTranslation, localesUI, uiLocale } = useLoginConfig()

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
                            locale.displayName === locale.name
                                ? locale.displayName
                                : `${locale.name} — ${locale.displayName}`
                        }
                    />
                ))}
        </SingleSelectField>
    )
}
