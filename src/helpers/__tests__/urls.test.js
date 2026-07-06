import { pathWithUsername } from '../urls.js'

describe('pathWithUsername', () => {
    it('returns the bare path when no username is given', () => {
        expect(pathWithUsername('/reset-password', '')).toBe('/reset-password')
        expect(pathWithUsername('/reset-password', undefined)).toBe(
            '/reset-password'
        )
    })

    it('appends the username as a query param', () => {
        expect(pathWithUsername('/reset-password', 'admin')).toBe(
            '/reset-password?username=admin'
        )
    })

    it('url-encodes special characters in the username', () => {
        expect(pathWithUsername('/change-expired-password', 'a&b+c d#e')).toBe(
            '/change-expired-password?username=a%26b%2Bc%20d%23e'
        )
    })
})
