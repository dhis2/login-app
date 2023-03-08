import i18n from '@dhis2/d2-i18n'

export const isRequired = (val) => val ? undefined : i18n.t('This field is required') 