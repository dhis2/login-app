import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginConfig } from '../providers/index.js'

export const useRedirectIfNotAllowed = (requiredSettings) => {
    // redirect to main page if password reset is not allowed
    const loginConfig = useLoginConfig()
    const navigate = useNavigate()

    let redirect = false
    for (const setting of requiredSettings) {
        if (loginConfig[setting] === false) {
            redirect = true
            break
        }
    }

    useEffect(() => {
        if (redirect) {
            console.log(
                'This page is not enabled; redirecting to main login page.'
            )
            navigate('/')
        }
    }, [redirect, navigate])
}
