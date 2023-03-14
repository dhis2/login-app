import { CssReset, CssVariables } from '@dhis2/ui'
import React from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Footer from './components/footer.js'
import Header from './components/header.js'
// (confirm this isn't tree shaken)
import i18n from './locales/index.js' // eslint-disable-line
import CreateAccountPage from './pages/create-account.js'
import LoginPage from './pages/login.js'
import PasswordResetFormPage from './pages/password-reset.js'
import { LoginConfigProvider } from './providers/index.js'
import './styles.css'
import './externalStyles.css'

const AppContent = () => {
    // if we are using redirect parameter, read it here (to persist if user navigates around app)
    // const [searchParams] = useSearchParams() // (react-router-dom useSearchParams
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/create-account" element={<CreateAccountPage />} />
                <Route
                    path="/reset-password"
                    element={<PasswordResetFormPage />}
                />
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
