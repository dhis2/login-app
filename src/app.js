import { CssReset, CssVariables } from '@dhis2/ui'
import React from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Footer from './components/footer.js'
import Header from './components/header.js'
// (confirm this isn't tree shaken)
import i18n from './locales/index.js' // eslint-disable-line
import {
    CompleteRegistrationPage,
    CreateAccountPage,
    ConfirmEmailPage,
    LoginPage,
    PasswordResetRequestPage,
    PasswordUpdatePage,
} from './pages/index.js'
import { LoginConfigProvider } from './providers/index.js'
import './styles.css'
import './externalStyles.css'

const AppContent = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/create-account" element={<CreateAccountPage />} />
                <Route
                    path="complete-registration"
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
            <Footer />
        </>
    )
}
const App = () => (
    <BrowserRouter>
        <LoginConfigProvider>
            <div className="App">
                <CssReset />
                <CssVariables colors spacers theme elevations />
                <AppContent />
            </div>
        </LoginConfigProvider>
    </BrowserRouter>
)

export default App
