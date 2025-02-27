import { ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { checkIsLoginFormValid } from '../../helpers/index.js'
import { InnerLoginForm } from './InnerLoginForm.js'
import { LoginErrors } from './LoginErrors.js'

export const LoginForm = ({
    login,
    cancelTwoFA,
    twoFAVerificationRequired,
    emailtwoFAVerificationRequired,
    twoFAIncorrect,
    emailTwoFAIncorrect,
    accountInaccessible,
    passwordExpired,
    passwordResetEnabled,
    unknownStatus,
    error,
    setError,
    loading,
    setFormUserName,
    lngs,
}) => {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isResetButtonPressed, setIsResetButtonPressed] = useState(false)
    const [twoFAError, setTwoFAError] = useState(false)

    if (!login) {
        return null
    }

    const handleLogin = (values) => {
        setFormSubmitted(true)
        if (
            !checkIsLoginFormValid(values) ||
            (twoFAVerificationRequired &&
                !values.twoFA &&
                !isResetButtonPressed)
        ) {
            setTwoFAError(true)
            return
        }

        setTwoFAError(false)
        login({
            username: values.username,
            password: values.password,
            twoFA: values.twoFA,
        })
    }

    return (
        <>
            <LoginErrors
                lngs={lngs}
                error={error}
                twoFAIncorrect={twoFAIncorrect}
                passwordExpired={passwordExpired}
                passwordResetEnabled={passwordResetEnabled}
                accountInaccessible={accountInaccessible}
                unknownStatus={unknownStatus}
                emailTwoFAIncorrect={emailTwoFAIncorrect}
                isResetButtonPressed={isResetButtonPressed}
                twoFAError={twoFAError}
            />

            <ReactFinalForm.Form onSubmit={handleLogin}>
                {({ handleSubmit }) => (
                    <InnerLoginForm
                        handleSubmit={handleSubmit}
                        formSubmitted={formSubmitted}
                        twoFAVerificationRequired={twoFAVerificationRequired}
                        showResentCode={
                            emailtwoFAVerificationRequired ||
                            emailTwoFAIncorrect
                        }
                        twoFAIncorrect={twoFAIncorrect}
                        cancelTwoFA={cancelTwoFA}
                        lngs={lngs}
                        loading={loading}
                        setFormUserName={setFormUserName}
                        setIsResetButtonPressed={setIsResetButtonPressed}
                    />
                )}
            </ReactFinalForm.Form>
        </>
    )
}

LoginForm.defaultProps = {
    lngs: ['en'],
}

LoginForm.propTypes = {
    accountInaccessible: PropTypes.bool,
    cancelTwoFA: PropTypes.func,
    emailTwoFAIncorrect: PropTypes.bool,
    emailtwoFAVerificationRequired: PropTypes.bool,
    error: PropTypes.object,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    login: PropTypes.func,
    passwordExpired: PropTypes.bool,
    passwordResetEnabled: PropTypes.bool,
    setFormUserName: PropTypes.func,
    twoFAIncorrect: PropTypes.bool,
    twoFAVerificationRequired: PropTypes.bool,
    unknownStatus: PropTypes.bool,
}
