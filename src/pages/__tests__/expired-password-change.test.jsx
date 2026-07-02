import { useDataMutation } from '@dhis2/app-runtime'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { useFeatureToggle } from '../../hooks/useFeatureToggle.js'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { renderWithRouter } from '../../test-utils/render-with-router.jsx'
import ExpiredPasswordChangePage from '../expired-password-change.jsx'

const mockParamsGet = jest.fn((param) => {
    if (param === 'username') {
        return 'test_user'
    }
    return null
})

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(() => [
        {
            get: mockParamsGet,
        },
    ]),
}))

const mockMutate = jest.fn()

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useDataMutation: jest.fn(() => [
        mockMutate,
        { loading: false, fetching: false, error: false, data: null },
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
        renderWithRouter(<ExpiredPasswordChangePage />)

        expect(useDataMutation).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'auth/updatePassword' })
        )
    })

    it('renders the fields and prefills the username read-only from the url', () => {
        renderWithRouter(<ExpiredPasswordChangePage />)

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
        renderWithRouter(<ExpiredPasswordChangePage />)

        expect(screen.getByLabelText('Current password')).toBeInTheDocument()
    })

    it('calls the mutation with username, oldPassword and the new password', async () => {
        const user = userEvent.setup()
        renderWithRouter(<ExpiredPasswordChangePage />)

        await user.type(screen.getByLabelText('Current password'), 'Old_pw_1!')
        await user.type(screen.getByLabelText('New password'), 'V3ry_$ecure_')
        await user.type(
            screen.getByLabelText('Confirm new password'),
            'V3ry_$ecure_'
        )
        await user.click(
            screen.getByRole('button', { name: /save new password/i })
        )

        expect(mockMutate).toHaveBeenCalledWith({
            username: 'test_user',
            oldPassword: 'Old_pw_1!',
            newPassword: 'V3ry_$ecure_',
        })
    })

    it('blocks submit and shows an error when the confirmation does not match', async () => {
        const user = userEvent.setup()
        renderWithRouter(<ExpiredPasswordChangePage />)

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
        renderWithRouter(<ExpiredPasswordChangePage />)

        await user.type(
            screen.getByLabelText('New password'),
            'does not meet requirements[TAB]'
        )

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
        renderWithRouter(<ExpiredPasswordChangePage />)

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
        renderWithRouter(<ExpiredPasswordChangePage />)

        expect(
            screen.getByText(/your password has been updated/i)
        ).toBeInTheDocument()
        expect(
            screen.queryByRole('button', { name: /save new password/i })
        ).not.toBeInTheDocument()
    })
})
