// Builds a path with an optional ?username= query param, url-encoding the value so a
// username containing &, +, # or a space produces a valid link. Shared by the login
// links (forgot password) and the expired-password change link.
export const pathWithUsername = (path, username) =>
    username ? `${path}?username=${encodeURIComponent(username)}` : path
