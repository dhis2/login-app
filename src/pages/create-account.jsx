import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useRef, useState } from 'react'
import {
    CreateAccountForm,
    CREATE_FORM_TYPES,
    FormContainer,
    NotAllowedNoticeCreateAccount,
} from '../components/index.js'
import { useGetErrorIfNotAllowed } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'

const selfRegisterMutation = {
    resource: 'auth/registration',
    type: 'create',
    data: (data) => data,
}

const CreateAccountFormWrapper = () => {
    const { selfRegistrationNoRecaptcha } = useLoginConfig()
    const recaptchaRef = useRef()
    const [recaptchaError, setRecaptchaError] = useState(false)
    const [selfRegister, { loading, fetching, error, data }] =
        useDataMutation(selfRegisterMutation)

    const handleSelfRegister = (values) => {
        setRecaptchaError(false)
        const gRecaptchaResponse = selfRegistrationNoRecaptcha
            ? null
            : recaptchaRef.current.getValue()
        if (!selfRegistrationNoRecaptcha && !gRecaptchaResponse) {
            setRecaptchaError(true)
            return
        }
        selfRegister(
            selfRegistrationNoRecaptcha
                ? values
                : { ...values, 'g-recaptcha-response': gRecaptchaResponse }
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
    const { lngs } = useLoginConfig()
    const { notAllowed } = useGetErrorIfNotAllowed(
        requiredPropsForCreateAccount
    )

    if (notAllowed) {
        return <NotAllowedNoticeCreateAccount lngs={lngs} />
    }

    return (
        <FormContainer title={i18n.t('Create account', { lngs })} variableWidth>
            <CreateAccountFormWrapper />
        </FormContainer>
    )
}

export default CreateAccountPage
