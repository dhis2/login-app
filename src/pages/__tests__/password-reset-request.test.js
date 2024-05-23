import { useDataMutation } from '@dhis2/app-runtime'
import { screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { renderWithRouter } from '../../test-utils/render-with-router.js'
import PasswordResetRequestPage from '../password-reset-request.js'

jest.mock('../../components/not-allowed-notice.js', () => ({
    NotAllowedNotice: () => <div>NOT ALLOWED</div>,
}))

jest.mock('../../components/back-to-login-button.js', () => ({
    BackToLoginButton: () => <div>BACK_TO_LOGIN</div>,
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(() => [
        {
            get: (param) => {
                if (param === 'username') {
                    return 'lakris'
                }
                return null
            },
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

describe('PasswordResetRequestPage', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('shows back to login button if page is available', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordResetRequestPage />)

        expect(screen.getByText('BACK_TO_LOGIN')).toBeInTheDocument()
    })

    it('has mutation that points to auth/forgotPassword', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordResetRequestPage />)

        expect(useDataMutation).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'auth/forgotPassword' })
        )
    })

    it('calls mutation when reset password is clicked', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordResetRequestPage />)

        fireEvent.click(
            screen.getByRole('button', {
                name: /send password reset/i,
            })
        )

        expect(mockMutate).toHaveBeenCalled()
    })

    it('displays not allowed notice if allowAccountRecovery:false', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: false,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordResetRequestPage />)
        expect(screen.getByText('NOT ALLOWED')).toBeInTheDocument()
    })

    it('displays not allowed notice if emailConfigured:false', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: false,
        })
        renderWithRouter(<PasswordResetRequestPage />)
        expect(screen.getByText('NOT ALLOWED')).toBeInTheDocument()
    })

    it('displays not allowed notice if emailConfigured:false', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: false,
        })
        renderWithRouter(<PasswordResetRequestPage />)
        expect(screen.getByText('NOT ALLOWED')).toBeInTheDocument()
    })

    it('populates url from username parameters if one is provide', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        renderWithRouter(<PasswordResetRequestPage />)
        expect(screen.getByDisplayValue('lakris')).toHaveAttribute(
            'id',
            'emailOrUsername'
        )
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
        renderWithRouter(<PasswordResetRequestPage />)
        expect(screen.getByText(/password reset failed/i)).toBeInTheDocument()
    })

    it('displays message about email sent if mutation succeeeds', async () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
        })
        useDataMutation.mockReturnValue([() => {}, { data: { success: true } }])
        renderWithRouter(<PasswordResetRequestPage />)
        expect(
            screen.getByText(/you will soon receive an email/i)
        ).toBeInTheDocument()
    })
})
