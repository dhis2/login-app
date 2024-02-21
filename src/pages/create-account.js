import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
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
    const [resetPassword, { loading, fetching, error, data }] =
        useDataMutation(selfRegisterMutation)

    const handleSelfRegister = (values) => {
        resetPassword(values)
    }
    return (
        <CreateAccountForm
            createType={CREATE_FORM_TYPES.create}
            loading={loading || fetching}
            error={error}
            data={data}
            handleRegister={handleSelfRegister}
            prepopulatedFields={{}}
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
