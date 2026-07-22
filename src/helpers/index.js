export {
    checkIsLoginFormValid,
    getIsRequired,
    composeAndTranslateValidators,
    passwordsMatch,
} from './validators.js'
export { convertHTML, removeHTMLTags, sanitizeMainHTML } from './handleHTML.js'
export {
    redirectTo,
    getRedirectString,
    pathWithUsername,
} from './redirectHelpers.js'
export { getHashFromLocation } from './getHashFromLocation.js'
export { parseLocale, getLngsArray } from './locales.js'
export { getPasswordValidator } from './passwordValidatorRegex.js'
