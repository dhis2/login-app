import { useDataMutation } from '@dhis2/app-runtime'
import React, {useState} from 'react'

// To be updated based on https://dhis2.atlassian.net/browse/DHIS2-14613

const loginMutation = {
    resource: 'auth/login',
    type: 'create',
    data: ({ language }) => language,
}

const useLogin = ({redirectTo}) => {
    const [twoFAVerificationRequired, setTwoFAVerificationRequired] = useState(false)
    const [twoFANotEnabled, setTwoFANotEnabled] = useState(false)
    const [otherError, setOtherError] = useState(false)

    const cancelTwoFA = () => {
        setTwoFAVerificationRequired(false)
    }

    const [login, { called, loading, fetching, error, data }] = useDataMutation(
        loginMutation,
        {
            onComplete: () => {
                window.location.href = redirectTo
            },
            onError: (e) => {
                // if error indicates that 2FA is required
                if ('two fa required logic') {
                    setTwoFAVerificationRequired(true)
                }
                else if (!'two fa needs enabling logic') {
                    setTwoFANotEnabled(true)
                }
                else {
                    console.error(e)
                    setOtherError(true)
                }
                
            }
        }
    )

    return {login, cancelTwoFA, loading: loading || fetching, error: otherError, twoFAVerificationRequired, twoFANotEnabled}
}

export default useLogin
