import { CssReset, CssVariables } from "@dhis2/ui";
import i18n from './locales/'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from "react";
import Header from "./components/header.js";
import Footer from "./components/footer.js";
import LoginPage from "./pages/login.js";
import CreateAccount from "./pages/create-account.js";
import { PasswordResetFormContainer } from "./pages/password-reset.js";
import { LoginConfigProvider } from "./providers/login-config-provider";
import './styles.css'
import './externalStyles.css'

export default function App() {
  return (
    <BrowserRouter>
    <LoginConfigProvider>
      <div className='App'>
        <CssReset />
        <CssVariables colors spacers theme elevations />
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route
            path="/reset-password"
            element={<PasswordResetFormContainer />}
          />
        </Routes>
        <Footer />
      </div>
      </LoginConfigProvider>
    </BrowserRouter>
  );
}
