import { dhis2Password } from '@dhis2/ui'
import { getPasswordValidator } from '../helpers/index.js'
import { useLoginConfig } from '../providers/index.js'
import { useFeatureToggle } from './useFeatureToggle.js'

// Canonical "choose a new password" field validator, shared by every form that sets a
// password (password reset, expired-password change, account creation). When the regex
// toggle is on it enforces the configured length/complexity policy, otherwise it falls
// back to the @dhis2/ui dhis2Password validator. Pass errorText to override the message
// shown on a policy failure (account creation shows a short "Invalid password" instead).
export const useNewPasswordValidator = ({ errorText } = {}) => {
    const { validatePasswordWithRegex } = useFeatureToggle()
    const { minPasswordLength, maxPasswordLength } = useLoginConfig()

    return validatePasswordWithRegex
        ? getPasswordValidator({
              minPasswordLength,
              maxPasswordLength,
              errorText,
          })
        : dhis2Password
}
