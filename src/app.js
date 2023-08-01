import { useLoginSettings } from '@dhis2/app-runtime'
import {
    CssReset,
    CssVariables,
    LoginForm,
    PasswordResetRequestForm,
    PasswordUpdateForm,
    CreateAccountForm,
    CompleteRegistrationForm,
    ConfirmEmailForm,
} from '@dhis2/ui'
import parse from 'html-react-parser'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import {
    HashRouter,
    Navigate,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom'
import { ApplicationNotification } from './components/application-notification.js'
import {
    ApplicationDescription,
    ApplicationFooter,
    ApplicationTitle,
    Flag,
    LanguageSelect,
    Logo,
    PoweredByDHIS2,
} from './components/customizable-elements.js'
import { Loader } from './components/loader.js'
import i18n from './locales/index.js'
import {
    LoginPage,
    ConfirmEmailPage,
    CompleteRegistrationPage,
    CreateAccountPage,
    PasswordResetRequestPage,
    PasswordUpdatePage,
} from './pages/index.js'
// import { LoginConfigProvider, useLoginConfig } from './providers/index.js'
import { standard, sidebar, custom, crazy } from './templates/index.js'
// import { LoginForm } from '@dhis2/ui'

const FormStyling = ({ children }) => (
    <>
        <div className="form-outer-wrapper">
            <div className="form-wrapper">{children}</div>
        </div>
        <style>{`
        .form-outer-wrapper {
            display: flex;
            margin-block-end: var(--spacers-dp24);
        }
        .form-wrapper {
            display: inline-block;
            margin: 0 auto;
            width: auto;
            padding: var(--spacers-dp24);
            background: var(--form-container-background-color, var(--colors-white));
            border-radius: var(--form-container-box-border-radius, 5px);
            box-shadow: var(--form-container-box-shadow, var(--elevations-e400));    
        }
      `}</style>
    </>
)

FormStyling.propTypes = {
    children: PropTypes.node,
}

const LoginRoutes = ({ determineIfOnMainPage }) => {
    const location = useLocation()
    useEffect(() => {
        determineIfOnMainPage(location?.pathname)
    }, [location, determineIfOnMainPage])
    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route
                path="/create-account"
                element={<CreateAccountForm width="460px" />}
            />
            <Route
                path="/complete-registration"
                element={<CompleteRegistrationForm />}
            />
            <Route
                path="/reset-password"
                element={<PasswordResetRequestForm />}
            />
            <Route path="/update-password" element={<PasswordUpdateForm />} />
            <Route path="/confirm-email" element={<ConfirmEmailForm />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

LoginRoutes.propTypes = {
    determineIfOnMainPage: PropTypes.func,
}

const LoginFormStyled = () => {
    const [onMainPage, setOnMainPage] = useState(false)

    const determineIfOnMainPage = useCallback(
        () => (pathname) => {
            if (pathname === '/') {
                setOnMainPage(true)
            } else {
                setOnMainPage(false)
            }
        },
        [setOnMainPage]
    )

    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme elevations />
            <div className="showLogin">
                <FormStyling>
                    <HashRouter>
                        <LoginRoutes
                            determineIfOnMainPage={determineIfOnMainPage}
                        />
                    </HashRouter>
                </FormStyling>
                <div
                    className={
                        onMainPage
                            ? 'showAppNotificationMainPage'
                            : 'showAppNotificationNonMainPage'
                    }
                >
                    <ApplicationNotification />
                </div>
            </div>
            <style>{`
                .showLogin {
                    display: inline;
                }
                .hideLogin {
                    display: none;
                }
                .showAppNotificationMainPage {
                    display: inline;
                }
                .showAppNotificationNonMainPage {
                    display: var(--application-notification-non-main-page-display, none);
                }                
            `}</style>
        </>
    )
}

const options = {
    replace: ({ attribs }) => {
        if (!attribs) {
            return
        }

        if (attribs.id === 'login-box') {
            return <LoginFormStyled />
        }

        if (attribs.id === 'application-title') {
            return <ApplicationTitle />
        }

        if (attribs.id === 'application-description') {
            return <ApplicationDescription />
        }

        if (attribs.id === 'flag') {
            return <Flag />
        }

        if (attribs.id === 'logo') {
            return <Logo />
        }

        if (attribs.id === 'powered-by') {
            return <PoweredByDHIS2 />
        }

        if (attribs.id === 'application-footer') {
            return <ApplicationFooter />
        }

        if (attribs.id === 'language-select') {
            return <LanguageSelect />
        }
    },
}

const AppContent = () => {
    const { htmlTemplate } = useLoginSettings()
    let html
    if (htmlTemplate === 'sidebar') {
        html = sidebar
    } else if (htmlTemplate === 'custom') {
        html = custom
    } else if (htmlTemplate === 'crazy') {
        html = crazy
    } else {
        html = standard
    }

    return <>{parse(html, options)}</>
}

const localStorageLocaleKey = 'dhis2.locale.ui'

const App = () => {
    const { called, uiLocale } = useLoginSettings()

    // this is to prevent glitchiness with the language selector
    const [storedLanguageChecked, setStoredLanguageChecked] = useState(false)
    useEffect(() => {
        const storedLanguage = window.localStorage.getItem(
            localStorageLocaleKey
        )
        if (storedLanguage) {
            i18n.changeLanguage(storedLanguage, () => {
                setStoredLanguageChecked(true)
            })
        } else {
            setStoredLanguageChecked(true)
        }
    }, [])

    // this uses i18n to detect dir, but this maybe should be rethought?
    useEffect(() => {
        // i18n does not recognize country code when determining dir?
        i18n.changeLanguage(uiLocale.substring(0, 2))
    }, [uiLocale])

    if (!storedLanguageChecked) {
        return <Loader />
    }

    if (!called) {
        return <Loader />
    }

    return (
        <div dir={i18n.dir()}>
            <AppContent />
        </div>
    )
}

export default App
