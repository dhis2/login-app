import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useLoginConfig } from '../providers';

export const useRedirectIfNotAllowed = (requiredSettings) => {

    const loginConfig = useLoginConfig()
    const navigate = useNavigate();
    
    // redirect to main page if password reset is not allowed
    useEffect(()=>{
        let redirect = false
      for (const setting of requiredSettings) {
        if (loginConfig[setting] === false) {
            redirect = true
            break
        }
      }
      if (redirect) {
        console.log('This page is not enabled; redirecting.')
        navigate('/')
    }      
      },[requiredSettings])
}

