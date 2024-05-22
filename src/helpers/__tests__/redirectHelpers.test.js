import { getRedirectString } from '../../helpers/redirectHelpers.js'

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
})
