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
    uiLocale: 'undefined',
    localesUI: [],
    refreshOnTranslation: 'undefined (function)',
    defaultLoginPageLogo: './api/staticContent/logo_front',
    lngs: ['en'],
})

export { LoginConfigContext }
