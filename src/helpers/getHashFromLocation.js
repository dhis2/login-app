export const getHashFromLocation = (initialLocation) => {
    if (!initialLocation) {
        return undefined
    }
    if (initialLocation.indexOf('#/') === -1) {
        return undefined
    }
    const initialHashExtension = initialLocation.substring(
        initialLocation.indexOf('#/') + 2
    )

    // we check and exclude hash locations used by the login app
    const loginHashLocations = [
        'create-account',
        'complete-registration',
        'reset-password',
        'update-password',
        'safeMode',
        'download',
    ]
    return loginHashLocations.some((excludedLocation) =>
        initialHashExtension?.startsWith(excludedLocation)
    )
        ? undefined
        : `#/${initialHashExtension}`
}
