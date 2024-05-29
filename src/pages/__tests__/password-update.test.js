import { useDataMutation } from '@dhis2/app-runtime'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { renderWithRouter } from '../../test-utils/render-with-router.js'
import PasswordUpdatePage from '../password-update.js'

jest.mock('../../components/not-allowed-notice.js', () => ({
    NotAllowedNotice: () => <div>NOT ALLOWED</div>,
}))

const mockParamsGet = jest.fn((param) => {
    if (param === 'token') {
        return 'subway'
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

describe('PasswordUpdateForm', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('has mutation that points to auth/passwordReset', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordUpdatePage />)

        expect(useDataMutation).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'auth/passwordReset' })
        )
    })

    it('calls mutation with valid password and token from url parameter', async () => {
        const user = userEvent.setup()
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordUpdatePage />)

        await user.type(screen.getByLabelText('Password'), 'V3ry_$ecure_')
        await user.click(
            screen.getByRole('button', {
                name: /save new password/i,
            })
        )
        expect(mockMutate).toHaveBeenCalled()
        expect(mockMutate).toHaveBeenCalledWith({
            newPassword: 'V3ry_$ecure_',
            token: 'subway',
        })
    })

    it('does not call mutation when reset password is clicked if password input has invalid password', async () => {
        const user = userEvent.setup()
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordUpdatePage />)

        await user.type(
            screen.getByLabelText('Password'),
            'does not meet requirements'
        )
        await user.click(
            screen.getByRole('button', {
                name: /save new password/i,
            })
        )
        expect(mockMutate).not.toHaveBeenCalled()
    })

    it('displays not allowed notice if allowAccountRecovery:false', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: false,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordUpdatePage />)
        expect(screen.getByText('NOT ALLOWED')).toBeInTheDocument()
    })

    it('displays not allowed notice if emailConfigured:false', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: false,
        })
        renderWithRouter(<PasswordUpdatePage />)
        expect(screen.getByText('NOT ALLOWED')).toBeInTheDocument()
    })

    it('displays error message if error returned from mutation', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        useDataMutation.mockReturnValue([
            () => {},
            { error: new Error('some random error') },
        ])
        renderWithRouter(<PasswordUpdatePage />)
        expect(screen.getByText(/new password not saved/i)).toBeInTheDocument()
    })

    it('displays message about email sent if mutation succeeeds', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        useDataMutation.mockReturnValue([() => {}, { data: { success: true } }])
        renderWithRouter(<PasswordUpdatePage />)
        expect(screen.getByText(/New password saved/i)).toBeInTheDocument()
    })
})
