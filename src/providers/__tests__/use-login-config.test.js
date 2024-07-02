/* eslint-disable react/prop-types */
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { LoginConfigProvider } from '../login-config-provider.js'
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
    it('updates uiLocale on translation, keeps systemLocale unchanged ', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useLoginConfig(),
            { wrapper }
        )
        expect(result.current.systemLocale).toBe('en')
        expect(result.current.uiLocale).toBe('en')
        result.current.refreshOnTranslation({ locale: 'nb' })
        await waitForNextUpdate()
        expect(result.current.systemLocale).toBe('en')
        expect(result.current.uiLocale).toBe('nb')
    })

    it('updates translatable values on translation', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useLoginConfig(),
            { wrapper }
        )
        mockEngineQuery.mockResolvedValue({
            loginConfig: { ...TEST_TRANSLATIONS.nb },
        })

        result.current.refreshOnTranslation({ locale: 'nb' })
        await waitForNextUpdate()
        expect(result.current.applicationDescription).toBe('Glem ikke håndkle')
        // if value is not translated, keeps previous value
        expect(result.current.applicationNotification).toBe(
            'The meaning of the universe is 42'
        )
    })

    // note: this test confirms the INCORRECT behaviour in the app
    // app should fall back to default system locale values, but will persist last fetched translations
    // this does not cause problems because the api returns the default values
    it('falls back to default system language values on subsequent translations', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useLoginConfig(),
            { wrapper }
        )
        mockEngineQuery.mockResolvedValueOnce({
            loginConfig: { ...TEST_TRANSLATIONS.nb },
        })

        result.current.refreshOnTranslation({ locale: 'nb' })
        await waitForNextUpdate()
        expect(result.current.applicationLeftSideFooter).toBe(
            'Der universet slutter, på venstre siden'
        )

        mockEngineQuery.mockResolvedValueOnce({
            loginConfig: { ...TEST_TRANSLATIONS.fr },
        })
        result.current.refreshOnTranslation({ locale: 'fr' })
        await waitForNextUpdate()
        expect(result.current.applicationLeftSideFooter).toBe(
            'Der universet slutter, på venstre siden'
        )
        expect(result.current.applicationTitle).toBe(
            'Le guide du voyageur DHIS2'
        )
    })

    it('persists language in local storage as ui language on refreshOnTranslation', async () => {
        const spySetItem = jest.spyOn(Storage.prototype, 'setItem')
        const { result, waitForNextUpdate } = renderHook(
            () => useLoginConfig(),
            { wrapper }
        )
        result.current.refreshOnTranslation({ locale: 'zh' })
        await waitForNextUpdate()
        expect(spySetItem).toHaveBeenCalled()
        expect(spySetItem).toHaveBeenCalledWith('dhis2.locale.ui', 'zh')
    })

    it('updates document direction on refreshOnTranslation (if applicable)', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useLoginConfig(),
            { wrapper }
        )
        // uiLocale is 'en' by default, hence dir is 'ltr'
        expect(document.dir).toBe('ltr')
        result.current.refreshOnTranslation({ locale: 'ar' })
        await waitForNextUpdate()
        expect(document.dir).toBe('rtl')
        result.current.refreshOnTranslation({ locale: 'fr' })
        await waitForNextUpdate()
        expect(document.dir).toBe('ltr')
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
})
