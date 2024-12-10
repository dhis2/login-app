import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { FormContainer } from '../components/index.js'
import { useLoginConfig } from '../providers/index.js'

function EmailVerificationSuccess() {
    const { lngs } = useLoginConfig()
    return (
        <FormContainer title={i18n.t('Email confirmed', { lngs })}>
            <NoticeBox valid title="Your email has been confirmed.">
                You can now close this page.
            </NoticeBox>
        </FormContainer>
    )
}

export default EmailVerificationSuccess
