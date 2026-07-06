import { useDataMutation } from '@dhis2/app-runtime'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { useFeatureToggle } from '../../hooks/useFeatureToggle.js'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { renderWithRouter } from '../../test-utils/render-with-router.jsx'
import ExpiredPasswordChangePage from '../expired-password-change.jsx'

const renderPage = (username = 'test_user') =>
    renderWithRouter(<ExpiredPasswordChangePage />, {
        initialEntries: [
            username
                ? `/change-expired-password?username=${username}`
                : '/change-expired-password',
        ],
    })

const mockMutate = jest.fn()

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataMutation: jest.fn(() => [
        mockMutate,
        { loading: false, fetching: false, error: undefined, data: null },
    ]),
}))

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(),
}))

jest.mock('../../hooks/useFeatureToggle.js', () => ({
    useFeatureToggle: jest.fn(),
}))

const defaultConfig = {
    lngs: ['en'],
    minPasswordLength: 8,
    maxPasswordLength: 40,
}

describe('ExpiredPasswordChangePage', () => {
    beforeEach(() => {
        useLoginConfig.mockReturnValue(defaultConfig)
        useFeatureToggle.mockReturnValue({ validatePasswordWithRegex: false })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('points its mutation at the auth/updatePassword endpoint', () => {
        renderPage()

        expect(useDataMutation).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'auth/updatePassword' })
        )
    })

    it('sends only username, oldPassword and newPassword on the wire', () => {
        renderPage()

        const { data } = useDataMutation.mock.calls[0][0]
        expect(
            data({
                username: 'test_user',
                oldPassword: 'Old_pw_1!',
                newPassword: 'V3ry_$ecure_',
                confirmPassword: 'V3ry_$ecure_',
            })
        ).toEqual({
            username: 'test_user',
            oldPassword: 'Old_pw_1!',
            newPassword: 'V3ry_$ecure_',
        })
    })

    it('renders the fields and prefills the username read-only from the url', () => {
        renderPage()

        expect(screen.getByLabelText('Username')).toHaveValue('test_user')
        expect(screen.getByLabelText('Username')).toHaveAttribute('readonly')
        expect(screen.getByLabelText('Current password')).toBeInTheDocument()
        expect(screen.getByLabelText('New password')).toBeInTheDocument()
        expect(
            screen.getByLabelText('Confirm new password')
        ).toBeInTheDocument()
    })

    it('renders even when account recovery and email are not configured (no gate)', () => {
        useLoginConfig.mockReturnValue({
            ...defaultConfig,
            allowAccountRecovery: false,
            emailConfigured: false,
        })
        renderPage()

        expect(screen.getByLabelText('Current password')).toBeInTheDocument()
    })

    it('calls the mutation with username, oldPassword and the new password', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.type(screen.getByLabelText('Current password'), 'Old_pw_1!')
        await user.type(screen.getByLabelText('New password'), 'V3ry_$ecure_')
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'V3ry_$ecure_'
        )
        await user.click(
            screen.getByRole('button', { name: /save new password/i })
        )

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                username: 'test_user',
                oldPassword: 'Old_pw_1!',
                newPassword: 'V3ry_$ecure_',
            })
        )
    })

    it('can resubmit after a failed attempt (form does not get stuck)', async () => {
        const user = userEvent.setup()
        // app-runtime resolves a failed mutation to a promise that never settles; if the
        // submit handler returned it, react-final-form would stay submitting=true and block
        // every retry. The first call here mimics that never-settling promise.
        mockMutate.mockReturnValueOnce(new Promise(() => {}))
        renderPage()

        await user.type(screen.getByLabelText('Current password'), 'Old_pw_1!')
        await user.type(screen.getByLabelText('New password'), 'V3ry_$ecure_')
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'V3ry_$ecure_'
        )

        const save = screen.getByRole('button', { name: /save new password/i })
        await user.click(save)
        await user.click(save)

        expect(mockMutate).toHaveBeenCalledTimes(2)
    })

    it('blocks submit and shows an error when the confirmation does not match', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.type(screen.getByLabelText('Current password'), 'Old_pw_1!')
        await user.type(screen.getByLabelText('New password'), 'V3ry_$ecure_')
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'does_not_match'
        )
        await user.click(
            screen.getByRole('button', { name: /save new password/i })
        )

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
        expect(mockMutate).not.toHaveBeenCalled()
    })

    it('validates the new password against the password policy', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.type(
            screen.getByLabelText('New password'),
            'does not meet requirements'
        )
        await user.tab()

        expect(
            screen.queryByText(
                'Password should contain at least one UPPERCASE letter'
            )
        ).toBeInTheDocument()
    })

    it('surfaces the server error message when the mutation fails', () => {
        useDataMutation.mockReturnValue([
            mockMutate,
            { error: { details: { message: 'Account is not expired' } } },
        ])
        renderPage()

        expect(
            screen.getByText(/could not update password/i)
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
})
