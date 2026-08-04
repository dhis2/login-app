import {
    getRedirectString,
    pathWithUsername,
} from '../../helpers/redirectHelpers.js'

describe('getRedirectString', () => {
    const ACTUAL_ENVIRONMENT_VARIABLES = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...ACTUAL_ENVIRONMENT_VARIABLES }
    })

    afterAll(() => {
        process.env = ACTUAL_ENVIRONMENT_VARIABLES
    })

    it('returns redirect string if defined', () => {
        // Set the variables
        process.env.NODE_ENV = 'prod'
        const redirectString = getRedirectString({
            response: { redirectUrl: 'toHere' },
            baseUrl: 'path/',
        })
        expect(redirectString).toBe('toHere')
    })

    it('returns baseurl if redirect string is not defined', () => {
        // Set the variables
        process.env.NODE_ENV = 'prod'
        const redirectString = getRedirectString({
            response: {},
            baseUrl: 'path/',
        })
        expect(redirectString).toBe('path/')
    })

    it('returns base url + redirectUrl if in development mode', () => {
        // Set the variables
        process.env.NODE_ENV = 'development'
        const redirectString = getRedirectString({
            response: { redirectUrl: 'toHere' },
            baseUrl: 'path/',
        })
        expect(redirectString).toBe('path/toHere')
    })

    it('includes hashRedirect if provided', () => {
        // Set the variables
        const redirectString = getRedirectString({
            response: { redirectUrl: 'somewhere' },
            baseUrl: 'path/',
            hashRedirect: '#/withHash=true',
        })
        expect(redirectString).toBe('somewhere#/withHash=true')
    })
})

describe('pathWithUsername', () => {
    it('appends the username as a query param when provided', () => {
        expect(pathWithUsername('/reset-password', 'mbise')).toBe(
            '/reset-password?username=mbise'
        )
    })

    it('encodes special characters in the username', () => {
        expect(pathWithUsername('/reset-password', 'Fl@klypa.no')).toBe(
            '/reset-password?username=Fl%40klypa.no'
        )
    })

    it('returns the path unchanged when no username is provided', () => {
        expect(pathWithUsername('/reset-password', '')).toBe('/reset-password')
    })
})
