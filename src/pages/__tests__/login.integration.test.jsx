import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../login.jsx'

const getCustomData = (statusMessage) => ({
    'auth/login': { loginStatus: statusMessage },
})

const login = async () => {
    await userEvent.type(screen.getByLabelText('Username'), 'Fl@klypa.no')
    await userEvent.type(screen.getByLabelText('Password'), 'SolanOgLudvig')

    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
}

const Wrapper = ({ statusMessage, children }) => (
    <CustomDataProvider data={getCustomData(statusMessage)}>
        <MemoryRouter>{children}</MemoryRouter>
    </CustomDataProvider>
)

Wrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    statusMessage: PropTypes.string,
}

describe('LoginForm', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('shows password expired messages if status is PASSWORD_EXPIRED', async () => {
        render(
            <Wrapper statusMessage={'PASSWORD_EXPIRED'}>
                <LoginPage />
            </Wrapper>
        )
        await login()

        expect(screen.getByText('Password expired')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })

    it('shows account not accessible message if status is ACCOUNT_DISABLED', async () => {
        render(
            <Wrapper statusMessage={'ACCOUNT_DISABLED'}>
                <LoginPage />
            </Wrapper>
        )
        await login()

        expect(screen.getByText('Account not accessible')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })

    it('shows account not accessible message if status is ACCOUNT_LOCKED', async () => {
        render(
            <Wrapper statusMessage={'ACCOUNT_LOCKED'}>
                <LoginPage />
            </Wrapper>
        )
        await login()

        expect(screen.getByText('Account not accessible')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })

    it('shows account not accessible message if status is ACCOUNT_EXPIRED', async () => {
        render(
            <Wrapper statusMessage={'ACCOUNT_EXPIRED'}>
                <LoginPage />
            </Wrapper>
        )
        await login()

        expect(screen.getByText('Account not accessible')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })

    it('shows something went wrong message if status is not a known status', async () => {
        const user = userEvent.setup()
        render(
            <Wrapper statusMessage={'this status is unexpected!'}>
                <LoginPage />
            </Wrapper>
        )
        await login({ user })

        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(
            screen.getByText('Contact your system administrator.')
        ).toBeInTheDocument()
    })
})
