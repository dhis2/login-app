export const getRedirectString = ({ response, baseUrl, hashRedirect }) => {
    if (process.env.NODE_ENV === 'development') {
        return baseUrl + response?.redirectUrl + (hashRedirect ?? '')
    }
    return response.redirectUrl
        ? `${response.redirectUrl}${hashRedirect ?? ''}`
        : baseUrl
}

export const redirectTo = (redirectDestination) => {
    window.location.href = redirectDestination
}
