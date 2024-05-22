import { checkIsLoginFormValid } from '../validators.js'

describe('checkIsLoginFormValid', () => {
    it('returns true if username and password have values', () => {
        expect(
            checkIsLoginFormValid({ username: 'some', password: 'thing' })
        ).toBe(true)
    }),
        it('returns false if username and password do not values', () => {
            expect(
                checkIsLoginFormValid({ username: null, password: null })
            ).toBe(false)
        })
})
