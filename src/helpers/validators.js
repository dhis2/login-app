import i18n from '@dhis2/d2-i18n'

export const getIsRequired = (uiLocale) => (val) =>
    val ? undefined : i18n.t('This field is required', { lng: uiLocale })

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
