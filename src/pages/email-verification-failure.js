import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import styles from './login.module.css'

function EmailVerificationFailure() {
    return (
        <div className={styles.card}>
            <h3>Email Verification Failed </h3>
            <NoticeBox error title="unable to verify your email">
                The verification link is invalid or has expired. Please request
                a new verification email.
            </NoticeBox>
        </div>
    )
}

export default EmailVerificationFailure
