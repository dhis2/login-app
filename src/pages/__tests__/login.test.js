import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { checkIsLoginFormValid } from '../../helpers/validators.js'
import { useLogin } from '../../hooks/useLogin.js'
import { LoginFormContainer } from '../login.js'

jest.mock('../../helpers/validators.js', () => ({
    getIsRequired: () => () => null,
    checkIsLoginFormValid: jest.fn(),
}))

const mockLogin = jest.fn()

jest.mock('../../hooks/useLogin.js', () => ({
    useLogin: jest.fn(() => ({
        login: mockLogin,
        cancelTwoFA: () => {},
        twoFAVerificationRequired: false,
    })),
}))

jest.mock('../../components/index.js', () => ({
    ...jest.requireActual('../../components/index.js'),
    LoginLinks: () => <p>LOGIN LINKS</p>,
    OIDCLoginOptions: () => <p>OIDC LOGIN OPTIONS</p>,
}))

describe('LoginForm', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('validates the form upon submission', () => {
        render(<LoginFormContainer />)

        fireEvent.click(
            screen.getByRole('button', {
                name: /log in/i,
            })
        )
        expect(checkIsLoginFormValid).toHaveBeenCalled()
    })

    it('performs login on submission (if form valid) ', () => {
        checkIsLoginFormValid.mockImplementation(() => true)
        render(<LoginFormContainer />)

        fireEvent.click(screen.getByRole('button'))
        expect(mockLogin).toHaveBeenCalled()
    })

    it('does not perform login on submission (if form is not valid) ', () => {
        checkIsLoginFormValid.mockImplementation(() => false)
        render(<LoginFormContainer />)

        fireEvent.click(screen.getByRole('button'))
        expect(mockLogin).not.toHaveBeenCalled()
    })

    it('cancels twofa when cancel is clicked', () => {
        const mockCancelTwoFA = jest.fn()
        useLogin.mockImplementationOnce(() => ({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: mockCancelTwoFA,
        }))
        render(<LoginFormContainer />)

        fireEvent.click(
            screen.getByRole('button', {
                name: /cancel/i,
            })
        )
        expect(mockCancelTwoFA).toHaveBeenCalled()
    })

    // ideally would check visibility of fields in these states, but not working in tests due to jsdom interpretation of css
    it('has header of "log in" if twoFAVerificationRequired is false', () => {
        render(<LoginFormContainer />)

        expect(screen.getByRole('heading', { name: /log in/i })).not.toBe(null)
    })

    it('has header of "Two-factor authentication" if twoFAVerificationRequired is true', () => {
        useLogin.mockImplementationOnce(() => ({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: () => {},
        }))
        render(<LoginFormContainer />)

        expect(
            screen.getByRole('heading', { name: /two-factor authentication/i })
        ).not.toBe(null)
    })

    it('shows incorrect username error on 401 error ', () => {
        useLogin.mockImplementationOnce(() => ({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
            error: { httpStatusCode: 401 },
        }))
        render(<LoginFormContainer />)

        expect(screen.getByText('Incorrect username or password')).toBeVisible()
    })

    it('does not show inputs if login function is not defined ', () => {
        useLogin.mockImplementationOnce(() => ({ login: null }))
        render(<LoginFormContainer />)

        expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    })

    it('hides login links and oidc login options if two fa required ', () => {
        useLogin.mockImplementationOnce(() => ({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: () => {},
        }))
        render(<LoginFormContainer />)

        expect(screen.queryByText('LOGIN LINKS')).toBe(null)
        expect(screen.queryByText('OIDC LOGIN OPTIONS')).toBe(null)
    })

    it('show login links and oidc login options if two fa not (yet) required ', () => {
        useLogin.mockImplementationOnce(() => ({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
        }))
        render(<LoginFormContainer />)

        expect(screen.getByText('LOGIN LINKS')).toBeInTheDocument()
        expect(screen.getByText('OIDC LOGIN OPTIONS')).toBeInTheDocument()
    })
})
