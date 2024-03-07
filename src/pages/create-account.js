import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useRef, useState } from 'react'
import {
    CreateAccountForm,
    CREATE_FORM_TYPES,
    FormContainer,
    NotAllowedNotice,
} from '../components/index.js'
import { useGetErrorIfNotAllowed } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'

const selfRegisterMutation = {
    resource: 'auth/register',
    type: 'create',
    data: (data) => data,
}

const CreateAccountFormWrapper = () => {
    const { recaptchaSite } = useLoginConfig()
    const recaptchaRef = useRef()
    const [recaptchaError, setRecaptchaError] = useState(false)
    const [selfRegister, { loading, fetching, error, data }] =
        useDataMutation(selfRegisterMutation)

    const handleSelfRegister = (values) => {
        setRecaptchaError(false)
        const gRecaptchaResponse = recaptchaSite
            ? recaptchaRef.current.getValue()
            : null
        if (recaptchaSite && !gRecaptchaResponse) {
            setRecaptchaError(true)
            return
        }
        selfRegister(
            recaptchaSite
                ? { ...values, 'g-recaptcha-response': gRecaptchaResponse }
                : values
        )
    }
    return (
        <CreateAccountForm
            createType={CREATE_FORM_TYPES.create}
            loading={loading || fetching}
            error={error}
            data={data}
            handleRegister={handleSelfRegister}
            prepopulatedFields={{}}
            recaptchaRef={recaptchaRef}
            recaptchaError={recaptchaError}
        />
    )
}

const requiredPropsForCreateAccount = ['selfRegistrationEnabled']

const CreateAccountPage = () => {
    const { uiLocale } = useLoginConfig()
    const { notAllowed } = useGetErrorIfNotAllowed(
        requiredPropsForCreateAccount
    )

    if (notAllowed) {
        return <NotAllowedNotice uiLocale={uiLocale} />
    }

    return (
        <FormContainer
            title={i18n.t('Create account', { lng: uiLocale })}
            variableWidth
        >
            <CreateAccountFormWrapper />
        </FormContainer>
    )
}

export default CreateAccountPage
