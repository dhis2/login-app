import { useConfig } from '@dhis2/app-runtime'
import { useLoginConfig } from '../providers/index.js'

export const useFeatureToggle = () => {
    const { apiVersion } = useConfig()
    const { minPasswordLength, maxPasswordLength, passwordValidationPattern } =
        useLoginConfig()
    const validatePasswordWithRegex = Boolean(
        apiVersion >= 42 &&
            minPasswordLength &&
            maxPasswordLength &&
            passwordValidationPattern
    )
    return { validatePasswordWithRegex }
}
