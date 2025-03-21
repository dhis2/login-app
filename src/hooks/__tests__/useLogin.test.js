import { useDataMutation } from '@dhis2/app-runtime'
import { act, renderHook } from '@testing-library/react'
import { redirectTo } from '../../helpers/redirectHelpers.js'
import { useLogin } from '../useLogin.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataMutation: jest.fn(() => [() => {}, { loading: false }]),
}))

jest.mock('../../helpers/redirectHelpers.js', () => ({
    redirectTo: jest.fn(() => {}),
    getRedirectString: jest.fn(() => 'redirect/path'),
}))

describe('useLogin', () => {
    it('returns a login function', () => {
        const { result } = renderHook(() => useLogin())
        expect(result.current).toHaveProperty('login')
        expect(typeof result.current.login).toBe('function')
    })

    it('redirects after receiving SUCCESS', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({ loginStatus: 'SUCCESS' })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => result.current.login())
        expect(result.current.loading).toBe(true)
        expect(redirectTo).toHaveBeenCalled()
    })

    it('sets twoFAVerificationRequired to true first time after receiving INCORRECT_TWO_FACTOR_CODE_TOTP ', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({
                    loginStatus: 'INCORRECT_TWO_FACTOR_CODE_TOTP',
                })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => result.current.login())
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFAVerificationRequired).toBe(true)
    })

    it('sets twoFAIncorrect to true second time after receiving INCORRECT_TWO_FACTOR_CODE_TOTP ', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({
                    loginStatus: 'INCORRECT_TWO_FACTOR_CODE_TOTP',
                })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
            result.current.login()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFAVerificationRequired).toBe(true)
        expect(result.current.twoFAIncorrect).toBe(true)
    })

    it('clears information about twoFA status if cancelTwoFAEmail is called ', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({
                    loginStatus: 'INCORRECT_TWO_FACTOR_CODE_TOTP',
                })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
            result.current.login()
            result.current.cancelTwoFA()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFAVerificationRequired).toBe(false)
        expect(result.current.twoFAIncorrect).toBe(false)
    })

    it('sets twoFAVerificationRequired to true first time after receiving EMAIL_TWO_FACTOR_CODE_SENT ', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({
                    loginStatus: 'EMAIL_TWO_FACTOR_CODE_SENT',
                })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => result.current.login())
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFAVerificationRequired).toBe(true)
    })

    it('sets emailTwoFAIncorrect to true second time after receiving EMAIL_TWO_FACTOR_CODE_SENT ', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({
                    loginStatus: 'EMAIL_TWO_FACTOR_CODE_SENT',
                })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
            result.current.login()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFAVerificationRequired).toBe(true)
        expect(result.current.emailTwoFAIncorrect).toBe(true)
    })

    it('clears information about twoFA status if cancelTwoFAEmail is called ', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({
                    loginStatus: 'EMAIL_TWO_FACTOR_CODE_SENT',
                })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
            result.current.login()
            result.current.cancelTwoFA()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFAVerificationRequired).toBe(false)
        expect(result.current.twoFAIncorrect).toBe(false)
    })

    it('sets twoFANotEnabled to true if INVALID received on login', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({ loginStatus: 'INVALID' })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.twoFANotEnabled).toBe(true)
    })

    it('returns error if login fails', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onError(new Error('mock'))
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe(null)
        act(() => {
            result.current.login()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.error).not.toBe(null)
    })

    it('sets passwordExpired to true after receiving PASSWORD_EXPIRED', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({ loginStatus: 'PASSWORD_EXPIRED' })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.passwordExpired).toBe(true)
    })

    const inaccessibleStatuses = [
        'ACCOUNT_DISABLED',
        'ACCOUNT_EXPIRED',
        'ACCOUNT_LOCKED',
    ]

    it.each(inaccessibleStatuses)(
        'sets accountInaccessible to true after receiving %p',
        (inaccessibleStatus) => {
            useDataMutation.mockImplementation((mutation, options) => [
                () => {
                    options.onComplete({ loginStatus: inaccessibleStatus })
                },
                { loading: false },
            ])

            const { result } = renderHook(() => useLogin())
            expect(result.current.loading).toBe(false)
            act(() => {
                result.current.login()
            })
            expect(result.current.loading).toBe(false)
            expect(result.current.accountInaccessible).toBe(true)
        }
    )

    it('sets unknownStatus to true after receiving an unexpected status', async () => {
        useDataMutation.mockImplementation((mutation, options) => [
            () => {
                options.onComplete({ loginStatus: 'I_AM_NEW_SURPRISE' })
            },
            { loading: false },
        ])

        const { result } = renderHook(() => useLogin())
        expect(result.current.loading).toBe(false)
        act(() => {
            result.current.login()
        })
        expect(result.current.loading).toBe(false)
        expect(result.current.unknownStatus).toBe(true)
    })
})
