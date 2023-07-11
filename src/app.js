import { CssReset, CssVariables } from '@dhis2/ui'
import parse from 'html-react-parser'
import React, {useEffect, useState} from 'react'
import { HashRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import {
    ApplicationDescription,
    ApplicationFooter,
    ApplicationTitle,
    Flag,
    LanguageSelect,
    Logo,
    PoweredByDHIS2,
} from './components/customizable-elements.js'
import { ApplicationNotification } from './components/application-notification.js'
import {
    LoginPage,
    ConfirmEmailPage,
    CompleteRegistrationPage,
    CreateAccountPage,
    PasswordResetRequestPage,
    PasswordUpdatePage,
} from './pages/index.js'
import { LoginConfigProvider, useLoginConfig } from './providers/index.js'
import i18n from './locales/index.js' // eslint-disable-line
import { standard, sidebar, custom, crazy } from './templates/index.js'
// import { LoginForm } from '@dhis2/ui'

const FormStyling = ({children}) => (
    <>
    <div className='form-outer-wrapper'>
    <div className='form-wrapper'>
        {children}
    </div>
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

const LoginRoutes = ({determineIfOnMainPage}) => {
    const location = useLocation()
    useEffect(()=>{
        determineIfOnMainPage(location?.pathname)
    },[location])
return(
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route
            path="/complete-registration"
            element={<CompleteRegistrationPage />}
        />
        <Route
            path="/reset-password"
            element={<PasswordResetRequestPage />}
        />
        <Route path="/update-password" element={<PasswordUpdatePage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
)
}

const LoginFormStyled = () => {

    const [onMainPage, setOnMainPage] = useState(false)

    const determineIfOnMainPage = (pathname) => {
        if (pathname === '/') {
            setOnMainPage(true)
        } else {
            setOnMainPage(false)
        }
    }

    return (
        <>
            <CssReset />
            <CssVariables colors spacers theme elevations />
            <div className='showLogin'>
            <FormStyling>
                <HashRouter>
                    <LoginRoutes determineIfOnMainPage={determineIfOnMainPage} />
                </HashRouter>
            </FormStyling>
            <div className={onMainPage ? 'showAppNotificationMainPage' : 'showAppNotificationNonMainPage'}>
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
    const { htmlTemplate } = useLoginConfig()
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

const App = () => {
    return <LoginConfigProvider><AppContent /></LoginConfigProvider>
}

export default App
