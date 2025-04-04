/* eslint-disable react/prop-types */
import { useDataQuery } from '@dhis2/app-runtime'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { LoginConfigProvider } from '../login-config-provider.jsx'
import { useLoginConfig } from '../use-login-config.js'

const mockEngineQuery = jest.fn()

const TEST_LOCALES = [
    { locale: 'ar', displayName: 'Arabic', name: 'العربية' },
    { locale: 'en', displayName: 'English', name: 'English' },
    { locale: 'nb', displayName: 'Norwegian', name: 'norsk' },
    { locale: 'fr', displayName: 'French', name: 'français' },
]

const TEST_TRANSLATIONS = {
    en: {
        applicationDescription: "Don't forget a towel",
        applicationLeftSideFooter:
            'At the end of the universe, on the left side',
        applicationRightSideFooter:
            'At the end of the universe, on the right side',
        applicationNotification: 'The meaning of the universe is 42',
        applicationTitle: "The Hithchiker's guide to DHIS2",
    },
    nb: {
        applicationDescription: 'Glem ikke håndkle',
        applicationLeftSideFooter: 'Der universet slutter, på venstre siden',
        applicationRightSideFooter: 'Der universet slutter, på høyre siden',
        applicationTitle: 'Haikerens guide til DHIS2',
    },
    fr: {
        applicationNotification:
            "La réponse à la grande question de l'univers et tout ça: 42",
        applicationTitle: 'Le guide du voyageur DHIS2',
    },
    es: {
        applicationTitle: 'Guía del autoestopista DHIS2',
    },
}

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataEngine: () => ({ query: mockEngineQuery }),
    useDataQuery: jest.fn((query, variables) => {
        if (query?.loginConfig?.resource === 'loginConfig') {
            return {
                data: {
                    loginConfig: {
                        ...TEST_TRANSLATIONS[
                            variables?.variables?.locale ?? 'en'
                        ],
                    },
                },
                loading: false,
                error: null,
            }
        }
        return {
            data: { localesUI: { ...TEST_LOCALES } },
            loading: false,
            error: null,
        }
    }),
}))

describe('useAppContext', () => {
    const wrapper = ({ children }) => (
        <LoginConfigProvider>{children}</LoginConfigProvider>
    )

    const createWrapperWithLocation = ({ initialLocation }) => {
        const WrapperWithLocation = ({ children }) => (
            <LoginConfigProvider initialLocation={initialLocation}>
                {children}
            </LoginConfigProvider>
        )
        return WrapperWithLocation
    }

    afterEach(() => {
        jest.clearAllMocks()
        localStorage.clear()
    })

    it('has refreshOnTranslation function', () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })

        expect(result.current).toHaveProperty('refreshOnTranslation')
        expect(typeof result.current.refreshOnTranslation).toBe('function')
    })

    // note: system language is English by default (if not provided by api)
    it('updates uiLocale and lngs (with fallback language) on translation, keeps systemLocale unchanged ', async () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        expect(result.current.systemLocale).toBe('en')
        expect(result.current.uiLocale).toBe('en')
        expect(result.current.lngs).toEqual(['en'])
        result.current.refreshOnTranslation({ locale: 'pt_BR' })
        await waitFor(() => {
            expect(result.current.systemLocale).toBe('en')
        })
        expect(result.current.uiLocale).toBe('pt_BR')
        expect(result.current.lngs).toEqual(['pt_BR', 'pt'])
    })

    it('updates translatable values on translation', async () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        mockEngineQuery.mockResolvedValue({
            loginConfig: { ...TEST_TRANSLATIONS.nb },
        })

        result.current.refreshOnTranslation({ locale: 'nb' })
        await waitFor(() => {
            expect(result.current.applicationDescription).toBe(
                'Glem ikke håndkle'
            )
        })

        // ToDO: investigate why this is failing - potentially an react-18 difference?
        // await waitFor(() => {
        //     // if value is not translated, keeps previous value
        //     expect(result.current.applicationNotification).toBe(
        //         'The meaning of the universe is 42'
        //     )
        // })
    })

    // note: this test confirms the INCORRECT behaviour in the app
    // app should fall back to default system locale values, but will persist last fetched translations
    // this does not cause problems because the api returns the default values
    it('falls back to default system language values on subsequent translations', async () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        mockEngineQuery.mockResolvedValueOnce({
            loginConfig: { ...TEST_TRANSLATIONS.nb },
        })

        result.current.refreshOnTranslation({ locale: 'nb' })
        await waitFor(() => {
            expect(result.current.applicationLeftSideFooter).toBe(
                'Der universet slutter, på venstre siden'
            )
        })
        // await waitFor(() => {

        // })

        mockEngineQuery.mockResolvedValueOnce({
            loginConfig: { ...TEST_TRANSLATIONS.fr },
        })
        result.current.refreshOnTranslation({ locale: 'fr' })

        expect(result.current.applicationLeftSideFooter).toBe(
            'Der universet slutter, på venstre siden'
        )
        await waitFor(() => {
            expect(result.current.applicationTitle).toBe(
                'Le guide du voyageur DHIS2'
            )
        })
    })

    it('persists language in local storage as ui language on refreshOnTranslation', async () => {
        const spySetItem = jest.spyOn(Storage.prototype, 'setItem')
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        result.current.refreshOnTranslation({ locale: 'zh' })
        await waitFor(() => {
            expect(spySetItem).toHaveBeenCalled()
            expect(spySetItem).toHaveBeenCalledWith('dhis2.locale.ui', 'zh')
        })
    })

    it('updates document direction on refreshOnTranslation (if applicable)', async () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        // uiLocale is 'en' by default, hence dir is 'ltr'
        expect(document.dir).toBe('ltr')
        result.current.refreshOnTranslation({ locale: 'ar' })
        await waitFor(() => {
            expect(document.dir).toBe('rtl')
        })
        result.current.refreshOnTranslation({ locale: 'fr' })
        await waitFor(() => {
            expect(document.dir).toBe('ltr')
        })
    })

    it('updates document direction on refreshOnTranslation (if applicable) and handles locales', async () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        // uiLocale is 'en' by default, hence dir is 'ltr'
        expect(document.dir).toBe('ltr')
        result.current.refreshOnTranslation({ locale: 'fa_IR' })
        await waitFor(() => {
            expect(document.dir).toBe('rtl')
        })
        result.current.refreshOnTranslation({ locale: 'fr_CA' })
        await waitFor(() => {
            expect(document.dir).toBe('ltr')
        })
    })

    it('uses language persisted in local storage as ui language when first loaded', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('es')
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        expect(result.current.uiLocale).toBe('es')
        expect(result.current.applicationTitle).toBe(
            'Guía del autoestopista DHIS2'
        )
    })

    it('has hashRedirect location as undefined by default', () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        expect(result.current.hashRedirect).toBe(undefined)
    })

    it('has hashRedirect determined provided window location', () => {
        const { result } = renderHook(() => useLoginConfig(), {
            wrapper: createWrapperWithLocation({
                initialLocation:
                    'https://myInstance.org/path/to/myApp/#/hashpath',
            }),
        })
        expect(result.current.hashRedirect).toBe('#/hashpath')
    })

    it('falls back to default values for min/max password length if none provided', () => {
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        expect(result.current.minPasswordLength).toBe(8)
        expect(result.current.maxPasswordLength).toBe(72)
    })

    it('falls back to default min/max password length if invalid values are provided', () => {
        useDataQuery.mockReturnValue({
            data: {
                loginConfig: {
                    minPasswordLength: 4.7,
                    maxPasswordLength: 'cat',
                },
            },
        })
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        expect(result.current.minPasswordLength).toBe(8)
        expect(result.current.maxPasswordLength).toBe(72)
    })

    it('uses valid min/max password length if those are provided', () => {
        useDataQuery.mockReturnValue({
            data: {
                loginConfig: { minPasswordLength: 4, maxPasswordLength: 55 },
                loading: false,
                error: null,
            },
        })
        const { result } = renderHook(() => useLoginConfig(), { wrapper })
        expect(result.current.minPasswordLength).toBe(4)
        expect(result.current.maxPasswordLength).toBe(55)
    })
})
