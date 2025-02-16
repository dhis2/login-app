import { render, screen, fireEvent } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { BackToLoginButton } from '../back-to-login-button.jsx'

const MainPage = () => <div>MAIN PAGE</div>
const OtherPage = ({ children }) => <>{children}</>

OtherPage.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/other']}>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/other" element={<OtherPage>{children}</OtherPage>} />
        </Routes>
    </MemoryRouter>
)

Wrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

describe('BackToLoginButton', () => {
    it('redirects to main page when clicked', () => {
        render(
            <Wrapper>
                <BackToLoginButton />
            </Wrapper>
        )
        expect(screen.queryByText('MAIN PAGE')).toBe(null)
        fireEvent.click(
            screen.getByRole('button', {
                name: /back to log in/i,
            })
        )
        expect(screen.getByText('MAIN PAGE')).not.toBe(null)
    })
})
