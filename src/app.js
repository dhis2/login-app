import { CssReset, CssVariables } from "@dhis2/ui";
import i18n from './locales/'
import { BrowserRouter, Navigate, Routes, Route, useSearchParams } from 'react-router-dom'
import React from "react";
import Header from "./components/header.js";
import Footer from "./components/footer.js";
import LoginPage from "./pages/login.js";
import CreateAccountPage from "./pages/create-account.js";
import PasswordResetFormPage from "./pages/password-reset.js";
import { LoginConfigProvider } from "./providers/login-config-provider";
import './styles.css'
import './externalStyles.css'

const AppContent = () => {
  // if we are using redirect parameter, read it here (to persist if user navigates around app) 
  const [searchParams] = useSearchParams()
  
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
    <Route
      path="*"
      element={<Navigate to="/" />}
    />          
  </Routes>
  <Footer />
  </ >
  )
}
const App = () => (
    <BrowserRouter>
      <LoginConfigProvider>
        <div className='App'>
          <CssReset />
          <CssVariables colors spacers theme elevations />
          <AppContent />
        </div>
      </LoginConfigProvider>
    </BrowserRouter>
  )

export default App