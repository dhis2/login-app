import { renderHook } from '@testing-library/react-hooks'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { useGetErrorIfNotAllowed } from '../useGetErrorIfNotAllowed.js'

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(),
}))

describe('useGetErrorIfNotAllowed', () => {
    it('returns notAllowed:false if all properties true in useLoginConfig', () => {
        useLoginConfig.mockReturnValue({ testPropOne: true, testPropTwo: true })
        const { result } = renderHook(() =>
            useGetErrorIfNotAllowed(['testPropOne', 'testPropTwo'])
        )
        expect(result.current).toHaveProperty('notAllowed')
        expect(result.current.notAllowed).toBe(false)
    })

    it('returns notAllowed:true if some properties false in useLoginConfig', () => {
        useLoginConfig.mockReturnValue({
            testPropOne: true,
            testPropTwo: false,
        })
        const { result } = renderHook(() =>
            useGetErrorIfNotAllowed(['testPropOne', 'testPropTwo'])
        )
        expect(result.current).toHaveProperty('notAllowed')
        expect(result.current.notAllowed).toBe(true)
    })

    it('returns notAllowed:true if some properties null in useLoginConfig', () => {
        useLoginConfig.mockReturnValue({ testPropOne: true })
        const { result } = renderHook(() =>
            useGetErrorIfNotAllowed(['testPropOne', 'testPropTwo'])
        )
        expect(result.current).toHaveProperty('notAllowed')
        expect(result.current.notAllowed).toBe(true)
    })
})
