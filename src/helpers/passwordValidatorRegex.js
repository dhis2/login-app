import i18n from '@dhis2/d2-i18n'
import { createPattern } from '@dhis2/ui'

export const getPasswordValidator = ({
    minPasswordLength,
    maxPasswordLength,
    errorText,
}) => {
    const passwordRegex = new RegExp(
        `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{${minPasswordLength},${maxPasswordLength}}$`
    )
    return createPattern(
        passwordRegex,
        errorText ??
            i18n.t(
                'Password should be between {{minPasswordLength}} and {{maxPasswordLength}} characters long, with at least one lowercase character, one uppercase character, one number, and one special character.',
                { minPasswordLength, maxPasswordLength }
            )
    )
}
