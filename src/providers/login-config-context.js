import { createContext } from 'react'

const LoginConfigContext = createContext({
    applicationDescription: "undefined",
    applicationFooter: "undefined",
    applicationNotification: "undefined",
    allowAccountRecovery: false,
    applicationTitle: "undefined",
    countryFlag: "undefined",
    useCountryFlag: false,
    loginPageLogo: "undefined",
    useLoginPageLogo: false,
    emailConfigured: false,
    selfRegistrationEnabled: false,
    selfRegistrationNoRecaptcha: false,
    uiLocale: "undefined",
    localesUI: [],
    refreshOnTranslation: "undefined (function)"
})

export { LoginConfigContext }