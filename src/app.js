import { CssReset, CssVariables } from '@dhis2/ui'
import parse from 'html-react-parser'
import React from 'react'
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom'
import {
    ApplicationDescription,
    ApplicationLeftFooter,
    ApplicationRightFooter,
    ApplicationTitle,
    Flag,
    LanguageSelect,
    Logo,
    PoweredByDHIS2,
} from './components/customizable-elements.js'
import { Popup } from './components/pop-up.js'
import { sanitizeMainHTML } from './helpers/handleHTML.js'
import {
    LoginPage,
    CompleteRegistrationPage,
    CreateAccountPage,
    PasswordResetRequestPage,
    PasswordUpdatePage,
    DownloadPage,
} from './pages/index.js'
import { LoginConfigProvider, useLoginConfig } from './providers/index.js'
import i18n from './locales/index.js' // eslint-disable-line
import { standard, sidebar } from './templates/index.js'

const LoginRoutes = () => {
    return (
        <>
            <Popup />
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
                <Route
                    path="/update-password"
                    element={<PasswordUpdatePage />}
                />
                <Route path="/download" element={<DownloadPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

const options = {
    replace: ({ attribs }) => {
        if (!attribs) {
            return
        }

        if (attribs.id === 'login-box') {
            return <LoginRoutes />
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

        if (attribs.id === 'application-left-footer') {
            return <ApplicationLeftFooter />
        }

        if (attribs.id === 'application-right-footer') {
            return <ApplicationRightFooter />
        }

        if (attribs.id === 'language-select') {
            return <LanguageSelect />
        }
    },
}

const AppContent = () => {
    const { loginPageLayout, loginPageTemplate } = useLoginConfig()
    let html
    if (loginPageLayout === 'SIDEBAR') {
        html = sidebar
    } else if (loginPageLayout === 'CUSTOM') {
        html = loginPageTemplate ?? standard
    } else {
        html = standard
    }

    return <>{parse(sanitizeMainHTML(html), options)}</>
}

const App = () => {
    return (
        <>
            <HashRouter>
                <LoginConfigProvider>
                    <CssReset />
                    <CssVariables colors spacers theme elevations />
                    <AppContent />
                </LoginConfigProvider>
            </HashRouter>
        </>
    )
}

export default App
