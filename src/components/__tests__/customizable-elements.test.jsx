import i18n from '@dhis2/d2-i18n'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { useLoginConfig } from '../../providers/use-login-config.js'
import {
    ApplicationDescription,
    ApplicationLeftFooter,
    ApplicationRightFooter,
    ApplicationTitle,
    LanguageSelect,
    PoweredByDHIS2,
} from '../customizable-elements.jsx'

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

describe('ApplicationTitle', () => {
    it('shows value from useLoginConfig', () => {
        useLoginConfig.mockReturnValue({
            applicationTitle: 'Little Red Riding Hood',
        })
        render(<ApplicationTitle />)
        expect(screen.getByText('Little Red Riding Hood')).toBeInTheDocument()
    })
})

describe('ApplicationDescription', () => {
    it('shows value from useLoginConfig', () => {
        useLoginConfig.mockReturnValue({
            applicationDescription:
                'Wolf eats grandmother; grandaugther gets house',
        })
        render(<ApplicationDescription />)
        expect(
            screen.getByText('Wolf eats grandmother; grandaugther gets house')
        ).toBeInTheDocument()
    })
})

describe('ApplicationLeftFooter', () => {
    it('shows value from useLoginConfig', () => {
        useLoginConfig.mockReturnValue({
            applicationLeftSideFooter: 'This way home',
        })
        render(<ApplicationLeftFooter />)
        expect(screen.getByText('This way home')).toBeInTheDocument()
    })
})

describe('ApplicationRightFooter', () => {
    it('shows value from useLoginConfig', () => {
        useLoginConfig.mockReturnValue({
            applicationRightSideFooter: "That way to grandma's",
        })
        render(<ApplicationRightFooter />)
        expect(screen.getByText("That way to grandma's")).toBeInTheDocument()
    })
})

describe('PoweredByDHIS2', () => {
    it('displays in translation', () => {
        useLoginConfig.mockReturnValue({
            lngs: ['id', 'en'],
        })
        const i18Spy = jest
            .spyOn(i18n, 't')
            .mockReturnValue('Dipersembahkan oleh DHIS2')
        render(<PoweredByDHIS2 />)
        expect(i18Spy).toHaveBeenCalled()
        expect(i18Spy).toHaveBeenCalledWith('Powered by DHIS2', {
            lngs: ['id', 'en'],
        })
        expect(
            screen.getByText('Dipersembahkan oleh DHIS2')
        ).toBeInTheDocument()
    })
})
