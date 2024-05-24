import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { LanguageSelect } from '../customizable-elements.js'

const mockRefreshOnTranslation = jest.fn()

const LANGUAGE_SELECT_DEFAULT_VALUES = {
    localesUI: [
        { locale: 'en', displayName: 'English', name: 'English' },
        { locale: 'fr', displayName: 'French', name: 'français' },
        { locale: 'cy', displayName: 'Welsh', name: 'Cymraeg' },
        { locale: 'dz', displayName: 'Dzongkha', name: 'རྫོང་ཁ་' },
        { locale: 'nv', displayName: 'Navajo', name: 'Diné bizaad' },
        { locale: 'wo', displayName: 'Wolof', name: 'Wolof làkk' },
    ],
    uiLocale: 'cy',
    systemLocale: 'en',
}

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(),
}))

describe('LanguageSelect', () => {
    it('displays uiLocale as selection', () => {
        useLoginConfig.mockReturnValue({
            ...LANGUAGE_SELECT_DEFAULT_VALUES,
            refreshOnTranslation: mockRefreshOnTranslation,
        })
        render(<LanguageSelect />)
        expect(screen.getByText('Cymraeg — Welsh')).toBeInTheDocument()
    })

    it('calls refreshOnTranslation', async () => {
        const user = userEvent.setup()
        useLoginConfig.mockReturnValue({
            ...LANGUAGE_SELECT_DEFAULT_VALUES,
            refreshOnTranslation: mockRefreshOnTranslation,
        })
        render(<LanguageSelect />)

        await user.click(screen.getByText('Cymraeg — Welsh'))
        await user.click(screen.getByText('Wolof làkk — Wolof'))
        expect(mockRefreshOnTranslation).toHaveBeenCalled()
        expect(mockRefreshOnTranslation).toHaveBeenCalledWith({ locale: 'wo' })
    })
})
