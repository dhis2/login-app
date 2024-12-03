import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import styles from './login.module.css'

function EmailVerificationSuccess() {
    return (
        <div className={styles.card}>
            <h3>Email confirmed</h3>
            <NoticeBox valid title="Your email has been confirmed.">
                You can now close this page.
            </NoticeBox>
        </div>
    )
}

export default EmailVerificationSuccess
