import { getHashFromLocation } from '../getHashFromLocation.js'

const loginHashLocations = [
    'create-account',
    'complete-registration',
    'reset-password',
    'update-password',
    'safeMode',
    'download',
]

describe('getHashFromLocation', () => {
    it('returns undefined if location is undefined', () => {
        const hashPath = getHashFromLocation()
        expect(hashPath).toBe(undefined)
    })

    it('returns everything after from first occurence of #/', () => {
        const hashPath = getHashFromLocation(
            'https://anInstance.org/path/to/app/#/?param1=val&param2#/thisShouldNotHappen'
        )
        expect(hashPath).toBe('#/?param1=val&param2#/thisShouldNotHappen')
    })

    it('returns undefined when initial url does not have a hash location', () => {
        const hashPath = getHashFromLocation(
            'https://anInstance.org/path/to/app/that/does/not/contain/a/hash/path'
        )
        expect(hashPath).toBe(undefined)
    })

    it.each(loginHashLocations)(
        'if hash path starts with %p, returns undefined',
        (reservedHashPath) => {
            const hashPath = getHashFromLocation(
                `http://myDhis2.org/path/to/app/#/${reservedHashPath}?andThen=somethingElse`
            )
            expect(hashPath).toEqual(undefined)
        }
    )
})
