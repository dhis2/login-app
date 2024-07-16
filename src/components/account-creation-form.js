import i18n from '@dhis2/d2-i18n'
import {
    ReactFinalForm,
    InputFieldFF,
    Button,
    ButtonStrip,
    IconErrorFilled24,
    colors,
} from '@dhis2/ui'
import {
    createCharacterLengthRange,
    dhis2Password,
    dhis2Username,
    email,
    internationalPhoneNumber,
} from '@dhis2/ui-forms'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link } from 'react-router-dom'
import { BackToLoginButton } from '../components/back-to-login-button.js'
import { FormNotice } from '../components/form-notice.js'
import { FormSubtitle } from '../components/form-subtitle.js'
import {
    getIsRequired,
    removeHTMLTags,
    composeAndTranslateValidators,
} from '../helpers/index.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './account-creation-form.module.css'

export const CREATE_FORM_TYPES = {
    create: 'create',
    confirm: 'confirm',
}

const AccountFormSection = ({ children, title }) => (
    <div className={styles.accountFormSection}>
        {title && <p className={styles.accountFormSectionTitle}>{title}</p>}
        {children}
    </div>
)

AccountFormSection.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    title: PropTypes.string,
}

const RecaptchaWarning = ({ lngs }) => (
    <div className={styles.recaptchaWarning}>
        <IconErrorFilled24 color={colors.red500} />
        <div className={styles.recaptchaWarningText}>
            {i18n.t(
                'Please confirm that you are not a robot by checking the checkbox.',
                { lngs }
            )}
        </div>
    </div>
)

RecaptchaWarning.propTypes = {
    lngs: PropTypes.arrayOf(PropTypes.string),
}

const InnerCreateAccountForm = ({
    handleSubmit,
    loading,
    lngs,
    prepopulatedFields,
    emailConfigured,
    recaptchaSite,
    recaptchaRef,
    recaptchaError,
    selfRegistrationNoRecaptcha,
}) => {
    const isRequired = getIsRequired(lngs?.[0])
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <AccountFormSection title={i18n.t('Log in details', { lngs })}>
                    <ReactFinalForm.Field
                        name="username"
                        label={i18n.t('Username', { lngs })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeAndTranslateValidators(
                            isRequired,
                            dhis2Username
                        )}
                        initialValue={prepopulatedFields?.username}
                        readOnly={
                            loading || Boolean(prepopulatedFields?.username)
                        }
                    />
                    <ReactFinalForm.Field
                        name="password"
                        label={i18n.t('Password', { lngs })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeAndTranslateValidators(
                            isRequired,
                            dhis2Password
                        )}
                        type="password"
                        readOnly={loading}
                        helpText={i18n.t(
                            'Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol'
                        )}
                    />
                </AccountFormSection>
                <AccountFormSection
                    title={i18n.t('Personal details', { lngs })}
                >
                    <ReactFinalForm.Field
                        name="firstName"
                        label={i18n.t('First name', { lngs })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeAndTranslateValidators(
                            isRequired,
                            createCharacterLengthRange(2, 160)
                        )}
                        readOnly={loading}
                    />
                    <ReactFinalForm.Field
                        name="surname"
                        label={i18n.t('Last name', { lngs })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeAndTranslateValidators(
                            isRequired,
                            createCharacterLengthRange(2, 160)
                        )}
                        readOnly={loading}
                    />
                    <ReactFinalForm.Field
                        name="email"
                        label={i18n.t('Email', { lngs })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeAndTranslateValidators(
                            isRequired,
                            email
                        )}
                        initialValue={prepopulatedFields?.email}
                        readOnly={loading || Boolean(prepopulatedFields?.email)}
                    />

                    {!emailConfigured && (
                        <ReactFinalForm.Field
                            name="phoneNumber"
                            label={i18n.t('Phone number', { lngs })}
                            component={InputFieldFF}
                            className={styles.inputField}
                            validate={composeAndTranslateValidators(
                                isRequired,
                                internationalPhoneNumber
                            )}
                            readOnly={loading}
                        />
                    )}
                </AccountFormSection>
                {!selfRegistrationNoRecaptcha && (
                    <AccountFormSection>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={recaptchaSite}
                            hl={lngs?.[0] ?? 'en'}
                        />
                        {recaptchaError && <RecaptchaWarning />}
                    </AccountFormSection>
                )}
            </div>
            <ButtonStrip>
                <Button primary type="submit" disabled={loading}>
                    {loading
                        ? i18n.t('Creating...', { lngs })
                        : i18n.t('Create account', { lngs })}
                </Button>
                <BackToLoginButton buttonText={i18n.t('Cancel', { lngs })} />
            </ButtonStrip>
        </form>
    )
}

InnerCreateAccountForm.propTypes = {
    emailConfigured: PropTypes.bool,
    handleSubmit: PropTypes.func,
    lngs: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    prepopulatedFields: PropTypes.object,
    recaptchaError: PropTypes.bool,
    recaptchaRef: PropTypes.node,
    recaptchaSite: PropTypes.string,
    selfRegistrationNoRecaptcha: PropTypes.bool,
}

export const CreateAccountForm = ({
    createType,
    prepopulatedFields,
    loading,
    error,
    data,
    handleRegister,
    recaptchaRef,
    recaptchaError,
}) => {
    // depends on https://dhis2.atlassian.net/browse/DHIS2-14615
    const {
        applicationTitle,
        lngs,
        emailConfigured,
        recaptchaSite,
        selfRegistrationNoRecaptcha,
    } = useLoginConfig()

    useEffect(() => {
        // we should scroll top top of the page when an error is registered, so user sees this
        if (error) {
            // this is not working?
            window.scroll(0, 0)
        }
    }, [error])

    return (
        <div>
            {!error && (
                <FormSubtitle>
                    <p>
                        {i18n.t(
                            'Enter your details below to create a {{- applicationName}} account.',
                            {
                                lngs,
                                applicationName:
                                    removeHTMLTags(applicationTitle),
                            }
                        )}
                    </p>
                    {createType === CREATE_FORM_TYPES.create && (
                        <p>
                            {i18n.t('Already have an account?', {
                                lngs,
                            })}{' '}
                            <Link to="/">{i18n.t('Log in.', { lngs })}</Link>
                        </p>
                    )}
                </FormSubtitle>
            )}

            <div>
                {error && (
                    <FormNotice
                        title={i18n.t(
                            'Something went wrong, and we could not register your account',
                            { lngs }
                        )}
                        error={true}
                    >
                        <span>{error?.message}</span>
                    </FormNotice>
                )}
                {data && (
                    <>
                        <FormNotice
                            title={i18n.t('Account created successfully', {
                                lngs,
                            })}
                            valid
                        >
                            <span>
                                {i18n.t(
                                    'You can use your username and password to log in.',
                                    { lngs }
                                )}
                            </span>
                        </FormNotice>
                        <BackToLoginButton />
                    </>
                )}
                {!data && (
                    <ReactFinalForm.Form onSubmit={handleRegister}>
                        {({ handleSubmit }) => (
                            <InnerCreateAccountForm
                                handleSubmit={handleSubmit}
                                lngs={lngs}
                                loading={loading}
                                prepopulatedFields={prepopulatedFields}
                                emailConfigured={emailConfigured}
                                recaptchaSite={recaptchaSite}
                                recaptchaRef={recaptchaRef}
                                recaptchaError={recaptchaError}
                                selfRegistrationNoRecaptcha={
                                    selfRegistrationNoRecaptcha
                                }
                            />
                        )}
                    </ReactFinalForm.Form>
                )}
            </div>
        </div>
    )
}

CreateAccountForm.propTypes = {
    createType: PropTypes.string.isRequired,
    handleRegister: PropTypes.func.isRequired,
    data: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,
    prepopulatedFields: PropTypes.object,
    recaptchaError: PropTypes.bool,
    recaptchaRef: PropTypes.node,
}
