import { useContext } from 'react'
import { LoginConfigContext } from './login-config-context'

export const useLoginConfig = () => useContext(LoginConfigContext)