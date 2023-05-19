import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useLoginConfig } from '../providers/index.js'

export const ApplicationTitle = () => {
    const { applicationTitle } = useLoginConfig()
    return applicationTitle ? <span>{applicationTitle}</span> : null
}

export const ApplicationDescription = () => {
    const { applicationDescription } = useLoginConfig()
    return applicationDescription ? <span>{applicationDescription}</span> : null
}

export const Flag = () => {
    const { useCountryFlag, countryFlag } = useLoginConfig()
    return useCountryFlag && countryFlag ? (
        <img src={countryFlag} alt="flag" />
    ) : null
}

export const Logo = () => {
    const { useLoginPageLogo, loginPageLogo } = useLoginConfig()
    return useLoginPageLogo && loginPageLogo ? (
        <img src={loginPageLogo} alt="logo" />
    ) : null
}

export const ApplicationFooter = () => {
    const { applicationFooter } = useLoginConfig()
    return applicationFooter ? <span>{applicationFooter}</span> : null
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
                        label={locale.name}
                    />
                ))}
        </SingleSelectField>
    )
}

export default function Header() {
    const {
        applicationDescription,
        applicationTitle,
        countryFlag,
        loginPageLogo,
        useCountryFlag,
        useLoginPageLogo,
    } = useLoginConfig()
    return (
        <>
            <div className="heading">
                <div className="title-container">
                    {useCountryFlag && countryFlag && (
                        <ExampleFlag flagSource="http://localhost:8080/dhis-web-commons/flags/norway.png" />
                    )}

                    <div className="titles">
                        {applicationTitle && (
                            <span
                                className="app-title"
                                dangerouslySetInnerHTML={{
                                    __html: applicationTitle,
                                }}
                            ></span>
                        )}
                        {applicationDescription && (
                            <span
                                className="app-description"
                                dangerouslySetInnerHTML={{
                                    __html: applicationDescription,
                                }}
                            ></span>
                        )}
                    </div>
                </div>
                {useLoginPageLogo && loginPageLogo && (
                    <ExampleLogo loginLogoSource={loginPageLogo} />
                )}
            </div>
            <style>{`
                .heading {
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                    align-content: top;
                    flex-wrap: wrap;
                    gap: var(--spacers-dp8);
                    min-height: 164px;
                    padding: var(--spacers-dp24);
                }
                .title-container {
                    display: flex;
                    gap: var(--spacers-dp16);
                }
                .flag {
                    height: 64px;
                    max-height: 64px;
                    max-width: 96px;
                    flex-shrink: 0;
                }
                .titles {
                    max-width: 480px;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacers-dp8);
                }
                .app-title {
                    font-size: 20px;
                    line-height: 28px;
                    color: var(--colors-grey050);
                }
                .app-description {
                    font-size: 14px;
                    line-height: 19px;
                    color: var(--colors-grey050);
                    opacity: 0.7;
                }
            `}</style>
        </>
    )
}

// if nepal, should have no border
const ExampleFlag = ({ flagSource }) => (
    <>
        <div className="flag">
            <img src={flagSource} alt="flag" />
        </div>
        <style>{`
            .flag {
                white-space: nowrap;
                display: inline;
            }
            .flag img {
                max-height: 64px;
                width: auto;
                border: 1px solid white;
            }
        `}</style>
    </>
)

ExampleFlag.propTypes = {
    flagSource: PropTypes.string,
}

const ExampleLogo = ({ loginLogoSource }) => (
    <>
        <div className="logo">
            <img src={loginLogoSource} alt="logo" />
        </div>
        <style>{`
            .logo {
                max-width: 200px;
                max-height: 120px;
                justify-items: start;
            }
            .logo img {
                width: 100%;
            }
        `}</style>
    </>
)

ExampleLogo.propTypes = {
    loginLogoSource: PropTypes.string,
}
