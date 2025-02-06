import { screen } from '@testing-library/react'
import React from 'react'
import { useLoginConfig } from '../../providers/use-login-config.js'
import { renderWithRouter } from '../../test-utils/render-with-router.jsx'
import { LoginLinks } from '../login-links.jsx'

jest.mock('../../providers/use-login-config.js', () => ({
    useLoginConfig: jest.fn(),
}))

describe('LoginLinks', () => {
    it('shows link to reset password if allowAccountRecovery and emailConfigured', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
            selfRegistrationEnabled: true,
        })
        renderWithRouter(<LoginLinks />)
        expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
        expect(
            screen.getByText(/forgot password/i).closest('a')
        ).toHaveAttribute('href', '/reset-password')
    })

    it('shows link to reset password if allowAccountRecovery and emailConfigured with username if passed', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
            selfRegistrationEnabled: true,
        })
        renderWithRouter(<LoginLinks formUserName="Askepott" />)
        expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
        expect(
            screen.getByText(/forgot password/i).closest('a')
        ).toHaveAttribute('href', '/reset-password?username=Askepott')
    })

    it('does not show link to reset password if allowAccountRecovery false', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: false,
            emailConfigured: true,
            selfRegistrationEnabled: true,
        })
        renderWithRouter(<LoginLinks />)
        expect(screen.queryByText(/forgot password/i)).toBe(null)
    })

    it('does not show link to reset password if emailConfigured false', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: false,
            selfRegistrationEnabled: true,
        })
        renderWithRouter(<LoginLinks />)
        expect(screen.queryByText(/forgot password/i)).toBe(null)
    })

    it('shows link to create account if selfRegistrationEnabled', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
            selfRegistrationEnabled: true,
        })
        renderWithRouter(<LoginLinks />)
        expect(screen.getByText(/create an account/i)).toBeInTheDocument()
        expect(
            screen.getByText(/create an account/i).closest('a')
        ).toHaveAttribute('href', '/create-account')
    })

    it('does not show link to create account if selfRegistrationEnabled is false', () => {
        useLoginConfig.mockReturnValue({
            allowAccountRecovery: true,
            emailConfigured: true,
            selfRegistrationEnabled: false,
        })
        renderWithRouter(<LoginLinks />)
        expect(screen.queryByText(/create an account/i)).toBe(null)
    })
})
