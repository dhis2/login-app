import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { checkIsLoginFormValid } from '../../helpers/validators.js'
import { useLogin } from '../../hooks/useLogin.js'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { LoginFormContainer } from '../login.jsx'

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
        passwordExpired: false,
        accountInaccessible: false,
    })),
}))

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(() => ({
        allowAccountRecovery: false,
        emailConfigured: false,
    })),
}))

jest.mock('../../components/index.js', () => ({
    ...jest.requireActual('../../components/index.js'),
    LoginLinks: () => <p>LOGIN LINKS</p>,
    OIDCLoginOptions: () => <p>OIDC LOGIN OPTIONS</p>,
}))

const renderWithRouter = (children) =>
    render(<MemoryRouter>{children}</MemoryRouter>)

describe('LoginForm', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('validates the form upon submission', async () => {
        render(<LoginFormContainer />)

        await userEvent.click(
            screen.getByRole('button', {
                name: /log in/i,
            })
        )
        expect(checkIsLoginFormValid).toHaveBeenCalled()
    })

    it('performs login on submission (if form valid) ', async () => {
        checkIsLoginFormValid.mockImplementation(() => true)
        render(<LoginFormContainer />)

        await userEvent.click(screen.getByRole('button'))
        expect(mockLogin).toHaveBeenCalled()
    })

    it('does not perform login on submission (if form is not valid) ', async () => {
        checkIsLoginFormValid.mockImplementation(() => false)
        render(<LoginFormContainer />)

        await userEvent.click(screen.getByRole('button'))
        expect(mockLogin).not.toHaveBeenCalled()
    })

    it('calls login function with username and password inputs provided by user', async () => {
        const user = userEvent.setup()

        checkIsLoginFormValid.mockImplementation(() => true)
        render(<LoginFormContainer />)

        await user.type(screen.getByLabelText('Username'), 'KiKi')
        await user.type(screen.getByLabelText('Password'), 'DeliveryService')
        await user.click(screen.getByRole('button'))

        expect(mockLogin).toHaveBeenCalled()
        expect(mockLogin).toHaveBeenCalledWith({
            password: 'DeliveryService',
            twoFA: '',
            username: 'KiKi',
        })
    })

    it('calls login function with username, password, and twofa inputs provided by user', async () => {
        const user = userEvent.setup()
        useLogin.mockReturnValue({
            login: mockLogin,
            twoFAVerificationRequired: true,
            cancelTwoFA: () => {},
        })

        checkIsLoginFormValid.mockImplementation(() => true)
        render(<LoginFormContainer />)

        await userEvent.type(screen.getByLabelText('Username'), 'Tintin')
        await userEvent.type(screen.getByLabelText('Password'), 'Milou')

        await user.type(screen.getByLabelText('Authentication code'), '123456')
        await user.click(
            screen.getByRole('button', {
                name: /log in/i,
            })
        )

        expect(mockLogin).toHaveBeenCalled()
        expect(mockLogin).toHaveBeenCalledWith({
            password: 'Milou',
            twoFA: '123456',
            username: 'Tintin',
        })
    })

    it('cancels twofa when cancel is clicked', async () => {
        const mockCancelTwoFA = jest.fn()
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: mockCancelTwoFA,
        })
        render(<LoginFormContainer />)

        await userEvent.click(
            screen.getByRole('button', {
                name: /cancel/i,
            })
        )
        expect(mockCancelTwoFA).toHaveBeenCalled()
    })

    it('clears twoFA and password fields when twoFA is cancelled ', async () => {
        const user = userEvent.setup()
        const mockCancelTwoFA = jest.fn()
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: mockCancelTwoFA,
        })
        render(<LoginFormContainer />)
        await userEvent.type(screen.getByLabelText('Username'), 'Bastian')
        await userEvent.type(screen.getByLabelText('Password'), 'Kardemomme')
        await user.click(screen.getByRole('button', { name: /log in/i }))
        await user.type(screen.getByLabelText('Authentication code'), '123456')
        await user.click(screen.getByRole('button', { name: /cancel/i }))

        expect(screen.getByLabelText('Username')).toHaveValue('Bastian')
        expect(screen.getByLabelText('Authentication code')).toHaveValue('')
        expect(screen.getByLabelText('Password')).toHaveValue('')
    })

    it('log in button is disabled if in loading state', async () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
            loading: true,
        })
        render(<LoginFormContainer />)
        expect(screen.getByRole('button')).toBeDisabled()
        expect(screen.getByText('Logging in...')).toBeInTheDocument()
    })

    it('has header of "log in" if twoFAVerificationRequired is false', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
        })
        render(<LoginFormContainer />)

        expect(screen.getByRole('heading', { name: /log in/i })).not.toBe(null)
    })

    it('has header of "Two-factor authentication" if twoFAVerificationRequired is true', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: () => {},
        })
        render(<LoginFormContainer />)

        expect(
            screen.getByRole('heading', { name: /two-factor authentication/i })
        ).not.toBe(null)
    })

    it('shows incorrect username error on 401 error ', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
            error: { details: { httpStatusCode: 401 } },
        })
        render(<LoginFormContainer />)

        expect(screen.getByText('Incorrect username or password')).toBeVisible()
    })

    it('shows something went wrong on error if 501 error, with message ', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
            error: {
                details: { httpStatusCode: 501 },
                message: 'Sorry about that',
            },
        })
        render(<LoginFormContainer />)

        expect(screen.getByText('Something went wrong')).toBeVisible()
        expect(screen.getByText('Sorry about that')).toBeVisible()
    })

    it('shows something went wrong if status code is not defined by error', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
            error: { message: "I'm not a teapot, I'm an error message" },
        })
        render(<LoginFormContainer />)

        expect(screen.getByText('Something went wrong')).toBeVisible()
        expect(
            screen.getByText("I'm not a teapot, I'm an error message")
        ).toBeVisible()
    })

    it('does not show inputs if login function is not defined ', () => {
        useLogin.mockReturnValue({ login: null })
        render(<LoginFormContainer />)

        expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    })

    it('hides login links and oidc login options if two fa required ', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: true,
            cancelTwoFA: () => {},
        })
        render(<LoginFormContainer />)

        expect(screen.queryByText('LOGIN LINKS')).toBe(null)
        expect(screen.queryByText('OIDC LOGIN OPTIONS')).toBe(null)
    })

    it('show login links and oidc login options if two fa not (yet) required ', () => {
        useLogin.mockReturnValue({
            login: () => {},
            twoFAVerificationRequired: false,
            cancelTwoFA: () => {},
        })
        render(<LoginFormContainer />)

        expect(screen.getByText('LOGIN LINKS')).toBeInTheDocument()
        expect(screen.getByText('OIDC LOGIN OPTIONS')).toBeInTheDocument()
    })

    it('shows a password-expired notice with links to change-expired-password and reset-password when allowAccountRecovery and emailConfigured are true', () => {
        useLogin.mockReturnValue({
            login: () => {},
            passwordExpired: true,
            cancelTwoFA: () => {},
        })
        useLoginConfig.mockReturnValueOnce({
            allowAccountRecovery: true,
            emailConfigured: true,
        })

        renderWithRouter(<LoginFormContainer />)

        expect(screen.getByText('Password expired')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Change your expired password' })
        ).toHaveAttribute('href', '/change-expired-password')
        expect(
            screen.getByRole('link', {
                name: 'You can reset your password from the password reset page.',
            })
        ).toHaveAttribute('href', '/reset-password')
    })

    it('shows a password-expired notice with only the change-expired-password link if allowAccountRecovery is false', () => {
        useLogin.mockReturnValue({
            login: () => {},
            passwordExpired: true,
            cancelTwoFA: () => {},
        })
        useLoginConfig.mockReturnValueOnce({
            allowAccountRecovery: false,
            emailConfigured: true,
        })

        renderWithRouter(<LoginFormContainer />)

        expect(
            screen.getByRole('link', { name: 'Change your expired password' })
        ).toHaveAttribute('href', '/change-expired-password')
        expect(
            screen.queryByRole('link', {
                name: 'You can reset your password from the password reset page.',
            })
        ).not.toBeInTheDocument()
    })

    it('shows a password-expired notice with only the change-expired-password link if emailConfigured is false', () => {
        useLogin.mockReturnValue({
            login: () => {},
            passwordExpired: true,
            cancelTwoFA: () => {},
        })
        useLoginConfig.mockReturnValueOnce({
            allowAccountRecovery: true,
            emailConfigured: false,
        })

        renderWithRouter(<LoginFormContainer />)

        expect(
            screen.getByRole('link', { name: 'Change your expired password' })
        ).toHaveAttribute('href', '/change-expired-password')
        expect(
            screen.queryByRole('link', {
                name: 'You can reset your password from the password reset page.',
            })
        ).not.toBeInTheDocument()
    })

    it('Shows Account not accessible if accountInaccessible is true', () => {
        useLogin.mockReturnValue({
            login: () => {},
            accountInaccessible: true,
            cancelTwoFA: () => {},
        })

        render(<LoginFormContainer />)

        expect(screen.getByText('Account not accessible')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })

    it('Shows Something went wrong if unknownStatus is true', () => {
        useLogin.mockReturnValue({
            login: () => {},
            unknownStatus: true,
            cancelTwoFA: () => {},
        })

        render(<LoginFormContainer />)

        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })
})
