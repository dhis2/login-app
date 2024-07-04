import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    BackToLoginButton,
    CreateAccountForm,
    CREATE_FORM_TYPES,
    FormContainer,
    FormNotice,
    NotAllowedNotice,
} from '../components/index.js'
import { useGetErrorIfNotAllowed } from '../hooks/index.js'
import { useLoginConfig } from '../providers/index.js'

const selfRegisterMutation = {
    resource: 'auth/invite',
    type: 'create',
    data: (data) => data,
}

const CompleteRegistrationFormWrapper = ({ lngs }) => {
    // depends on https://dhis2.atlassian.net/browse/DHIS2-14617
    const { selfRegistrationNoRecaptcha } = useLoginConfig()
    const recaptchaRef = useRef()
    const [recaptchaError, setRecaptchaError] = useState(false)
    const [completeInvitation, { loading, fetching, error, data }] =
        useDataMutation(selfRegisterMutation)

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const username = searchParams.get('username')

    if (!token || !email || !username) {
        return (
            <>
                <FormNotice
                    error={true}
                    title={i18n.t('Cannot process registration', {
                        lngs,
                    })}
                >
                    <span>
                        {i18n.t(
                            'Information required to process your registration is missing. Please contact your system administrator.'
                        )}
                    </span>
                </FormNotice>
                <BackToLoginButton />
            </>
        )
    }

    const prepopulatedFields = { email, username }

    const handleCompleteRegistration = (values) => {
        setRecaptchaError(false)
        const gRecaptchaResponse = selfRegistrationNoRecaptcha
            ? null
            : recaptchaRef.current.getValue()
        if (!selfRegistrationNoRecaptcha && !gRecaptchaResponse) {
            setRecaptchaError(true)
            return
        }
        completeInvitation(
            selfRegistrationNoRecaptcha
                ? { ...values, token }
                : {
                      ...values,
                      token,
                      'g-recaptcha-response': gRecaptchaResponse,
                  }
        )
    }
    return (
        <CreateAccountForm
            createType={CREATE_FORM_TYPES.complete}
            emailVerificationOnSuccess={false}
            loading={loading || fetching}
            error={error}
            data={data}
            handleRegister={handleCompleteRegistration}
            prepopulatedFields={prepopulatedFields}
            recaptchaRef={recaptchaRef}
            recaptchaError={recaptchaError}
        />
    )
}

CompleteRegistrationFormWrapper.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
}

const requiredPropsForCreateAccount = ['emailConfigured']

const CompleteRegistrationPage = () => {
    const { lngs } = useLoginConfig()
    const { notAllowed } = useGetErrorIfNotAllowed(
        requiredPropsForCreateAccount
    )

    if (notAllowed) {
        return <NotAllowedNotice lngs={lngs} />
    }

    return (
        <FormContainer title={i18n.t('Create account', { lngs })}>
            <CompleteRegistrationFormWrapper lngs={lngs} />
        </FormContainer>
    )
}

export default CompleteRegistrationPage
