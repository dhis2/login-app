import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { useFeatureToggle } from '../useFeatureToggle.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(),
}))

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(),
}))

/* eslint-disable max-params */
describe('useFeatureToggle', () => {
    it.each([
        [false, '41', '3', '7'],
        [true, '42', '3', '7'],
        [true, '42', '3.3', '7'],
        [false, '42', '3', undefined],
        [false, '42', undefined, '5'],
    ])(
        'evaluates to %b request with api version %s, minPasswordLength %s, maxPasswordLength %s',
        async (outcome, apiVersion, minPasswordLength, maxPasswordLength) => {
            useConfig.mockReturnValue({ apiVersion })
            useLoginConfig.mockReturnValue({
                minPasswordLength,
                maxPasswordLength,
            })
            const { result } = renderHook(() => useFeatureToggle())
            expect(result.current).toHaveProperty('validatePasswordWithRegex')
            expect(result.current.validatePasswordWithRegex).toBe(outcome)
        }
    )
})
/* eslint-enable max-params */
