import { useConfig } from '@dhis2/app-runtime'
import { useLoginConfig } from '../providers/index.js'

export const useFeatureToggle = () => {
    const { apiVersion } = useConfig()
    const { minPasswordLength, maxPasswordLength } = useLoginConfig()
    const validatePasswordWithRegex = Boolean(
        apiVersion >= 42 && minPasswordLength && maxPasswordLength
    )
    return { validatePasswordWithRegex }
}
