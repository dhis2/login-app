import { useContext } from 'react'
import { LoginConfigContext } from './login-config-context.js'

export const useLoginConfig = () => useContext(LoginConfigContext)
