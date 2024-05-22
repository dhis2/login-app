import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AppContent } from './app.js'
import { useLoginConfig } from './providers/use-login-config.js'

jest.mock('./components/customizable-elements.js', () => ({
    ...jest.requireActual('./components/customizable-elements.js'),
    LanguageSelect: () => <div>MOCK_LANGUAGE_SELECT</div>,
    ApplicationTitle: () => <div>MOCK_APPLICATION_TITLE</div>,
    ApplicationDescription: () => <div>MOCK_APPLICATION_DESCRIPTION</div>,
    Flag: () => <div>MOCK_FLAG</div>,
    Logo: () => <div>MOCK_LOGO</div>,
    ApplicationLeftFooter: () => <div>MOCK_APPLICATION_LEFT_FOOTER</div>,
    ApplicationRightFooter: () => <div>MOCK_APPLICATION_RIGHT_FOOTER</div>,
    PoweredByDHIS2: () => <div>MOCK_POWERED_BY</div>,
}))

jest.mock('./providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(() => ({
        loginPageLayout: 'DEFAULT',
        loginPageTemplate: null,
    })),
}))

jest.mock('./templates/index.js', () => ({
    __esModule: true,
    standard: '<div>STANDARD TEMPLATE</div>',
    sidebar: '<div>SIDEBAR TEMPLATE</div>',
}))

const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>)

describe('AppContent', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('loads standard template if loginPageLayout is DEFAULT', () => {
        renderWithRouter(<AppContent />)
        expect(screen.getByText('STANDARD TEMPLATE')).toBeInTheDocument()
    })

    it('loads sidebar template if loginPageLayout is SIDEBAR', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'SIDEBAR',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('SIDEBAR TEMPLATE')).toBeInTheDocument()
    })

    it('loads standard template if loginPageLayout is CUSTOM and loginPageTemplate is null', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: null,
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('STANDARD TEMPLATE')).toBeInTheDocument()
    })

    it('loads custom loginPageTemplate if loginPageLayout is CUSTOM and loginPageTemplate is not null', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div>CUSTOM TEMPLATE</div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('CUSTOM TEMPLATE')).toBeInTheDocument()
    })

    it('replaces application-title element with ApplicationTitle component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="application-title"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('MOCK_APPLICATION_TITLE')).toBeInTheDocument()
    })

    it('replaces application-introduction element with ApplicationDescription component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="application-introduction"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(
            screen.getByText('MOCK_APPLICATION_DESCRIPTION')
        ).toBeInTheDocument()
    })

    it('replaces application-title element with ApplicationDescription component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="application-title"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('MOCK_APPLICATION_TITLE')).toBeInTheDocument()
    })

    it('replaces application-title element with ApplicationDescription component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="application-title"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('MOCK_APPLICATION_TITLE')).toBeInTheDocument()
    })

    it('replaces flag element with Flag component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="flag"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('MOCK_FLAG')).toBeInTheDocument()
    })

    it('replaces logo element with Logo component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="logo"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('MOCK_LOGO')).toBeInTheDocument()
    })

    it('replaces powered-by element with PoweredBy component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="powered-by"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(screen.getByText('MOCK_POWERED_BY')).toBeInTheDocument()
    })

    it('replaces application-left-footer element with ApplicationLeftFooter component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="application-left-footer"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(
            screen.getByText('MOCK_APPLICATION_LEFT_FOOTER')
        ).toBeInTheDocument()
    })

    it('replaces application-right-footer element with ApplicationRightFooter component ', () => {
        useLoginConfig.mockImplementationOnce(() => ({
            loginPageLayout: 'CUSTOM',
            loginPageTemplate: '<div id="application-right-footer"></div>',
        }))
        renderWithRouter(<AppContent />)
        expect(
            screen.getByText('MOCK_APPLICATION_RIGHT_FOOTER')
        ).toBeInTheDocument()
    })
})
