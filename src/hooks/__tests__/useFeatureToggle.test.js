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
        [false, '41', '3', '7', '^OnlyThisAllowed$'],
        [false, '42', '3', '7', undefined],
        [true, '42', '3.3', '7', '^OnlyThisAllowed$'],
        [false, '42', '3', undefined, '^OnlyThisAllowed$'],
        [false, '42', undefined, '5', '^OnlyThisAllowed$'],
        [true, '42', '3', '7', '^OnlyThisAllowed$'],
    ])(
        'evaluates to %b request with api version %s, minPasswordLength %s, maxPasswordLength %s, passwordValidationPattern %s',
        async (
            outcome,
            apiVersion,
            minPasswordLength,
            maxPasswordLength,
            passwordValidationPattern
        ) => {
            useConfig.mockReturnValue({ apiVersion })
            useLoginConfig.mockReturnValue({
                minPasswordLength,
                maxPasswordLength,
                passwordValidationPattern,
            })
            const { result } = renderHook(() => useFeatureToggle())
            expect(result.current).toHaveProperty('validatePasswordWithRegex')
            expect(result.current.validatePasswordWithRegex).toBe(outcome)
        }
    )
})
/* eslint-enable max-params */
