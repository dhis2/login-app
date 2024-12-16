import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { FormContainer } from '../components/index.js'
import { useLoginConfig } from '../providers/index.js'

function EmailVerificationFailure() {
    const { lngs } = useLoginConfig()

    return (
        <FormContainer title={i18n.t('Email Verification Failed', { lngs })}>
            <NoticeBox error title={i18n.t('Unable to verify your email')}>
                {i18n.t(
                    'The verification link is invalid or has expired. Please request a new verification email.'
                )}
            </NoticeBox>
        </FormContainer>
    )
}

export default EmailVerificationFailure
