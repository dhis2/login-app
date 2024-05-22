export const getRedirectString = ({ response, baseUrl }) => {
    if (process.env.NODE_ENV === 'development') {
        return baseUrl + response?.redirectUrl
    }
    return response.redirectUrl ? `${response.redirectUrl}` : baseUrl
}

export const redirectTo = (redirectDestination) => {
    window.location.href = redirectDestination
}
