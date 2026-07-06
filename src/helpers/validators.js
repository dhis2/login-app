import i18n from '@dhis2/d2-i18n'

export const getIsRequired = (lng) => (val) =>
    val ? undefined : i18n.t('This field is required', { lng })

export const checkIsLoginFormValid = (values) => {
    const isRequired = getIsRequired('en') // 'en' because we do not need the actual translation for validation test
    const validatorsByField = {
        username: {
            value: values.username,
            validator: isRequired,
        },
        password: {
            value: values.password,
            validator: isRequired,
        },
    }
    for (const key of Object.keys(validatorsByField)) {
        if (validatorsByField[key].validator(validatorsByField[key].value)) {
            return false
        }
    }
    return true
}

// Confirm-password validator: the value must equal the form's newPassword field.
// Returns an untranslated message so it can be composed with composeAndTranslateValidators
// (which runs the result through i18n.t), matching every other field's translation path.
export const passwordsMatch = (value, allValues) =>
    value === allValues?.newPassword ? undefined : 'Passwords do not match'

export const composeAndTranslateValidators = (...validators) => {
    return (...args) => {
        return validators.reduce(
            (error, validator) => error || i18n.t(validator(...args)),
            undefined
        )
    }
}
