import { useDataMutation } from '@dhis2/app-runtime'
import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { useFeatureToggle } from '../../hooks/useFeatureToggle.js'
import { useLoginConfig } from '../../providers/use-login-config.js'
import ChangeExpiredPasswordPage from '../change-expired-password.jsx'

jest.mock('../../hooks/useFeatureToggle.js', () => ({
    useFeatureToggle: jest.fn(),
}))

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(),
}))

const mockMutate = jest.fn()

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataMutation: jest.fn(() => [
        mockMutate,
        { loading: false, fetching: false, error: undefined, data: null },
    ]),
}))

const renderPage = (username = 'mbise') =>
    render(
        <MemoryRouter
            initialEntries={[
                username
                    ? `/change-expired-password?username=${username}`
                    : '/change-expired-password',
            ]}
        >
            <ChangeExpiredPasswordPage />
        </MemoryRouter>
    )

describe('ChangeExpiredPasswordPage', () => {
    beforeEach(() => {
        useLoginConfig.mockReturnValue({})
        useFeatureToggle.mockReturnValue({ validatePasswordWithRegex: false })
        useDataMutation.mockReturnValue([
            mockMutate,
            { loading: false, fetching: false, error: undefined, data: null },
        ])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('points its mutation at the auth/updatePassword endpoint', () => {
        renderPage()

        expect(useDataMutation).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'auth/updatePassword' }),
            expect.anything()
        )
    })

    it('renders the fields and prefills the editable username from the url', () => {
        renderPage()

        expect(screen.getByLabelText('Username')).toHaveValue('mbise')
        expect(screen.getByLabelText('Username')).not.toHaveAttribute(
            'readonly'
        )
        expect(screen.getByLabelText('Username')).toHaveAttribute(
            'autocomplete',
            'username'
        )
        expect(screen.getByLabelText('Current password')).toBeInTheDocument()
        expect(screen.getByLabelText('Current password')).toHaveAttribute(
            'autocomplete',
            'current-password'
        )
        expect(screen.getByLabelText('New password')).toBeInTheDocument()
        expect(screen.getByLabelText('New password')).toHaveAttribute(
            'autocomplete',
            'new-password'
        )
        expect(
            screen.getByLabelText('Confirm new password')
        ).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm new password')).toHaveAttribute(
            'autocomplete',
            'new-password'
        )
    })

    it('renders an editable username field if none was provided via the url', () => {
        renderPage('')

        expect(screen.getByLabelText('Username')).toHaveValue('')
        expect(screen.getByLabelText('Username')).not.toHaveAttribute(
            'readonly'
        )
    })

    it('lets the user edit a pre-filled username', async () => {
        const user = userEvent.setup()
        renderPage('mbise')

        await user.clear(screen.getByLabelText('Username'))
        await user.type(screen.getByLabelText('Username'), 'someone_else')
        expect(screen.getByLabelText('Username')).toHaveValue('someone_else')
    })

    it('renders even when account recovery and email are not configured (no gate)', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: false,
            emailConfigured: false,
        })
        renderPage()

        expect(screen.getByLabelText('Current password')).toBeInTheDocument()
    })

    it('calls the mutation with username, oldPassword and the new password', async () => {
        const user = userEvent.setup()
        renderPage('mbise')

        await user.type(
            screen.getByLabelText('Current password'),
            'OldPassword1!'
        )
        await user.type(screen.getByLabelText('New password'), 'N3wPassword!')
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'N3wPassword!'
        )
        await user.click(
            screen.getByRole('button', { name: /save new password/i })
        )

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                username: 'mbise',
                oldPassword: 'OldPassword1!',
                newPassword: 'N3wPassword!',
            })
        )
    })

    it('does not send the confirmPassword field to the backend', () => {
        renderPage()

        const { data } = useDataMutation.mock.calls[0][0]
        expect(
            data({
                username: 'mbise',
                oldPassword: 'OldPassword1!',
                newPassword: 'N3wPassword!',
                confirmPassword: 'N3wPassword!',
            })
        ).toEqual({
            username: 'mbise',
            oldPassword: 'OldPassword1!',
            newPassword: 'N3wPassword!',
        })
    })

    it('does not call the mutation if the new password is invalid', async () => {
        const user = userEvent.setup()
        renderPage('')

        await user.type(screen.getByLabelText('Username'), 'mbise')
        await user.type(
            screen.getByLabelText('Current password'),
            'OldPassword1!'
        )
        await user.type(
            screen.getByLabelText('New password'),
            'does not meet requirements'
        )
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'does not meet requirements'
        )
        await user.click(
            screen.getByRole('button', { name: /save new password/i })
        )

        expect(mockMutate).not.toHaveBeenCalled()
    })

    it('does not call the mutation if the confirmation does not match the new password', async () => {
        const user = userEvent.setup()
        renderPage('mbise')

        await user.type(
            screen.getByLabelText('Current password'),
            'OldPassword1!'
        )
        await user.type(screen.getByLabelText('New password'), 'N3wPassword!')
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'SomethingDifferent1!'
        )
        await user.click(
            screen.getByRole('button', { name: /save new password/i })
        )

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
        expect(mockMutate).not.toHaveBeenCalled()
    })

    it('surfaces the server error message when the mutation fails', () => {
        useDataMutation.mockReturnValue([
            mockMutate,
            { error: { details: { message: 'Account is not expired' } } },
        ])
        renderPage()

        expect(
            screen.getByText('Could not update password')
        ).toBeInTheDocument()
        expect(screen.getByText('Account is not expired')).toBeInTheDocument()
    })

    it('shows a success message and hides the form when the mutation succeeds', () => {
        useDataMutation.mockReturnValue([
            mockMutate,
            { data: { httpStatus: 'OK' } },
        ])
        renderPage()

        expect(
            screen.getByText(/your password has been updated/i)
        ).toBeInTheDocument()
        expect(
            screen.queryByRole('button', { name: /save new password/i })
        ).not.toBeInTheDocument()
    })

    it('hides the expired-password subtitle and updates the title once the password update completes', () => {
        let onComplete
        useDataMutation.mockImplementation((_mutation, options) => {
            onComplete = options?.onComplete
            return [
                mockMutate,
                {
                    loading: false,
                    fetching: false,
                    error: undefined,
                    data: null,
                },
            ]
        })
        renderPage()

        expect(screen.getByText('Password expired')).toBeInTheDocument()
        expect(
            screen.getByText(/your password has expired/i)
        ).toBeInTheDocument()

        act(() => {
            onComplete({ httpStatus: 'OK' })
        })

        expect(screen.getByText('Password updated')).toBeInTheDocument()
        expect(screen.queryByText('Password expired')).not.toBeInTheDocument()
        expect(
            screen.queryByText(/your password has expired/i)
        ).not.toBeInTheDocument()
    })
})
