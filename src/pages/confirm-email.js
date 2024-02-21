import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    BackToLoginButton,
    FormContainer,
    FormNotice,
} from '../components/index.js'
import { useLoginConfig } from '../providers/index.js'

const confirmEmailMutation = {
    resource: 'auth/confirmEmailAccount',
    type: 'create',
    data: (data) => ({ ...data }),
}

const ConfirmEmailPage = () => {
    const { uiLocale } = useLoginConfig()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const [confirmEmail, { error, data }] =
        useDataMutation(confirmEmailMutation)

    useEffect(() => {
        if (token && email) {
            confirmEmail({ token, email })
        }
    }, [token, email, confirmEmail])

    return (
        <FormContainer title={i18n.t('Email confirmation', { lng: uiLocale })}>
            {error && (
                <FormNotice
                    error={true}
                    title={i18n.t('Could not confirm email', {
                        lng: uiLocale,
                    })}
                >
                    <span>
                        {i18n.t(
                            'Your link may have expired. Please try again and contact your system administrator if the problem remains.',
                            { lng: uiLocale }
                        )}
                    </span>
                </FormNotice>
            )}
            {data && (
                <FormNotice
                    valid={true}
                    title={i18n.t('Email confirmed', { lng: uiLocale })}
                >
                    <span>
                        {i18n.t(
                            'Your email is confirmed. You can now use your username and password to log in.',
                            { lng: uiLocale }
                        )}
                    </span>
                </FormNotice>
            )}
            <BackToLoginButton fullWidth />
        </FormContainer>
    )
}

export default ConfirmEmailPage
