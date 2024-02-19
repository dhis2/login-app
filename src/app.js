import { CssReset, CssVariables } from '@dhis2/ui'
import parse from 'html-react-parser'
import React from 'react'
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom'
import {
    ApplicationDescription,
    ApplicationFooter,
    ApplicationTitle,
    Flag,
    LanguageSelect,
    Logo,
    PoweredByDHIS2,
} from './components/customizable-elements.js'
import { Popup } from './components/pop-up.js'
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
import { standard, sidebar, custom } from './templates/index.js'

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
                <Route path="/confirm-email" element={<ConfirmEmailPage />} />
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
    } else {
        html = standard
    }

    return <>{parse(html, options)}</>
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
