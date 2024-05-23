import { useLoginConfig } from '../providers/index.js'

export const useGetErrorIfNotAllowed = (requiredSettings) => {
    // redirect to main page if password reset is not allowed
    const loginConfig = useLoginConfig()

    let notAllowed = false
    for (const setting of requiredSettings) {
        if (!loginConfig[setting]) {
            notAllowed = true
            break
        }
    }

    return { notAllowed }
}
