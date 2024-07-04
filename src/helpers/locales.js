export const parseLocale = (unparsedLocale) =>
    unparsedLocale?.replaceAll('_', '-')

export const getLngsArray = (locale) => {
    const [lng] = locale.split('_')
    return lng === locale ? [locale] : [locale, lng]
}
