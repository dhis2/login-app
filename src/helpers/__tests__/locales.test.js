import { parseLocale, getLngsArray } from '../locales.js'

describe('parseLocale', () => {
    it('handles one _', () => {
        expect(parseLocale('en_LK')).toBe('en-LK')
    })
    it('handles multiple _', () => {
        expect(parseLocale('mn_MN_Cyrl')).toBe('mn-MN-Cyrl')
    })
    it('handles no _', () => {
        expect(parseLocale('id')).toBe('id')
    })
})

describe('getLngsArray', () => {
    it('adds language from multipart locale', () => {
        expect(getLngsArray('fr_CA')).toEqual(['fr_CA', 'fr'])
    })
    it('returns array with just language when locale is only language', () => {
        expect(getLngsArray('fr')).toEqual(['fr'])
    })
})
