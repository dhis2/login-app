import i18n from '@dhis2/d2-i18n'
import { Button, InputFieldFF, ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-final-form'
import { getIsRequired } from '../../helpers/index.js'
import styles from '../login.module.css'

export const InnerLoginForm = ({
    handleSubmit,
    formSubmitted,
    twoFAVerificationRequired,
    showResentCode,
    resendTwoFACode,
    cancelTwoFA,
    lngs = ['en'],
    loading,
    setFormUserName,
    isResetButtonPressed,
    setIsResetButtonPressed,
}) => {
    const [isResendDisabled, setIsResendDisabled] = useState(false)

    const resendCode = () => {
        setIsResendDisabled(true)
        form.change('twoFA', undefined)
        setIsResetButtonPressed(true)
        const values = form.getState().values
        resendTwoFACode({
            twoFA: undefined,
            username: values.username,
            password: values.password,
        })
        setTimeout(() => {
            setIsResendDisabled(false)
        }, 30000)
    }

    const onSubmitPressed = () => {
        setIsResetButtonPressed(false)
    }

    const form = useForm()
    const ref = useRef()
    const clearTwoFA = () => {
        form.change('password', undefined)
        form.change('twoFA', undefined)
        form.focus()
        cancelTwoFA()
        ref?.current?.focus()
    }
    const loginButtonText = twoFAVerificationRequired
        ? i18n.t('Verify and log in', { lngs })
        : i18n.t('Log in', { lngs })
    const login2FAButtonText = twoFAVerificationRequired
        ? i18n.t('Verifying...', { lngs })
        : i18n.t('Logging in...', { lngs })
    const isRequired = getIsRequired(lngs[0])

    return (
        <form onSubmit={handleSubmit}>
            <div
                className={
                    twoFAVerificationRequired ? styles.hiddenFields : null
                }
            >
                {/* onChange will not update every change, so may need to use controlled InputField here for username tracking */}
                <ReactFinalForm.Field
                    name="username"
                    label={i18n.t('Username', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={!formSubmitted ? null : isRequired}
                    key={formSubmitted ? 1 : 0}
                    initialFocus={!twoFAVerificationRequired}
                    onBlur={(e) => {
                        setFormUserName(e.value)
                    }}
                    readOnly={loading}
                />
                <ReactFinalForm.Field
                    name="password"
                    label={i18n.t('Password', { lngs })}
                    type="password"
                    component={InputFieldFF}
                    className={styles.inputField}
                    validate={!formSubmitted ? null : isRequired}
                    key={formSubmitted ? 2 : 3}
                    readOnly={loading}
                />
            </div>

            <div
                className={
                    !twoFAVerificationRequired ? styles.hiddenFields : ''
                }
            >
                <ReactFinalForm.Field
                    name="twoFA"
                    label={i18n.t('Authentication code', { lngs })}
                    component={InputFieldFF}
                    className={styles.inputField}
                    initialValue=""
                    initialFocus={twoFAVerificationRequired}
                    readOnly={loading}
                />
            </div>
            <div className={styles.formButtons}>
                <Button
                    type="submit"
                    onClick={onSubmitPressed}
                    disabled={loading && !isResetButtonPressed}
                    primary
                >
                    {loading && !isResetButtonPressed
                        ? login2FAButtonText
                        : loginButtonText}
                </Button>
                {showResentCode && (
                    <Button
                        secondary
                        disabled={isResendDisabled || loading}
                        onClick={resendCode}
                    >
                        {i18n.t('Resend Code', { lngs })}
                    </Button>
                )}

                {twoFAVerificationRequired && (
                    <Button secondary disabled={loading} onClick={clearTwoFA}>
                        {i18n.t('Cancel', { lngs })}
                    </Button>
                )}
            </div>
        </form>
    )
}

InnerLoginForm.propTypes = {
    cancelTwoFA: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formSubmitted: PropTypes.bool,
    isResetButtonPressed: PropTypes.bool,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    resendTwoFACode: PropTypes.func,
    setFormUserName: PropTypes.func,
    setIsResetButtonPressed: PropTypes.func,
    showResentCode: PropTypes.bool,
    twoFAVerificationRequired: PropTypes.bool,
}
