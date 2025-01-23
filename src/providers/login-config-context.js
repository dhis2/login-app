import { createContext } from 'react'

const LoginConfigContext = createContext({
    applicationDescription: 'undefined',
    applicationFooter: 'undefined',
    applicationNotification: 'undefined',
    allowAccountRecovery: false,
    applicationTitle: 'undefined',
    countryFlag: 'undefined',
    useCountryFlag: false,
    loginPageLogo: null,
    emailConfigured: false,
    selfRegistrationEnabled: false,
    selfRegistrationNoRecaptcha: false,
    passwordValidationPattern: null,
    minPasswordLength: 8,
    maxPasswordLength: 72,
    uiLocale: 'undefined',
    localesUI: [],
    refreshOnTranslation: 'undefined (function)',
    defaultLoginPageLogo: './api/staticContent/logo_front',
    hashRedirect: undefined,
    lngs: ['en'],
})

export { LoginConfigContext }
