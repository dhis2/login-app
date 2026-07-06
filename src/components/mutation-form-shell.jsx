import { ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { BackToLoginButton } from './back-to-login-button.jsx'
import { FormNotice } from './form-notice.jsx'

// Shared skeleton for the "submit a mutation, then show success/error" password forms
// (password reset and expired-password change). It renders exactly one of three states:
// an error notice, a success notice + back-to-login button, or the form itself. Each page
// owns only its copy, its mutation, and its fields (passed as a render-prop child).
export const MutationFormShell = ({
    error,
    errorTitle,
    errorMessage,
    data,
    successMessage,
    onSubmit,
    children,
}) => (
    <div>
        {error && (
            <FormNotice title={errorTitle} error={true}>
                <span>{errorMessage}</span>
            </FormNotice>
        )}
        {data && (
            <>
                <FormNotice valid={true}>
                    <span>{successMessage}</span>
                </FormNotice>
                <BackToLoginButton fullWidth />
            </>
        )}
        {!data && (
            <ReactFinalForm.Form onSubmit={onSubmit}>
                {({ handleSubmit }) => children({ handleSubmit })}
            </ReactFinalForm.Form>
        )}
    </div>
)

MutationFormShell.propTypes = {
    children: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object,
    error: PropTypes.object,
    errorMessage: PropTypes.node,
    errorTitle: PropTypes.string,
    successMessage: PropTypes.node,
}
