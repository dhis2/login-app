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
    composeValidators,
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
import { getIsRequired, removeHTMLTags } from '../helpers/index.js'
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

const RecaptchaWarning = ({ uiLocale }) => (
    <div className={styles.recaptchaWarning}>
        <IconErrorFilled24 color={colors.red500} />
        <div className={styles.recaptchaWarningText}>
            {i18n.t(
                'Please confirm that you are not a robot by checking the checkbox.',
                { lng: uiLocale }
            )}
        </div>
    </div>
)

RecaptchaWarning.propTypes = {
    uiLocale: PropTypes.string,
}

const InnerCreateAccountForm = ({
    handleSubmit,
    uiLocale,
    loading,
    prepopulatedFields,
    emailConfigured,
    recaptchaSite,
    recaptchaRef,
    recaptchaError,
    selfRegistrationNoRecaptcha,
}) => {
    const isRequired = getIsRequired(uiLocale)
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <AccountFormSection
                    title={i18n.t('Log in details', { lng: uiLocale })}
                >
                    <ReactFinalForm.Field
                        name="username"
                        label={i18n.t('Username', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeValidators(isRequired, dhis2Username)}
                        initialValue={prepopulatedFields?.username}
                        readOnly={
                            loading || Boolean(prepopulatedFields?.username)
                        }
                    />
                    <ReactFinalForm.Field
                        name="password"
                        label={i18n.t('Password', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeValidators(isRequired, dhis2Password)}
                        type="password"
                        readOnly={loading}
                        helpText={i18n.t(
                            'Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol'
                        )}
                    />
                </AccountFormSection>
                <AccountFormSection
                    title={i18n.t('Personal details', { lng: uiLocale })}
                >
                    <ReactFinalForm.Field
                        name="firstName"
                        label={i18n.t('First name', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeValidators(
                            isRequired,
                            createCharacterLengthRange(2, 160)
                        )}
                        readOnly={loading}
                    />
                    <ReactFinalForm.Field
                        name="surname"
                        label={i18n.t('Last name', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeValidators(
                            isRequired,
                            createCharacterLengthRange(2, 160)
                        )}
                        readOnly={loading}
                    />
                    <ReactFinalForm.Field
                        name="email"
                        label={i18n.t('Email', { lng: uiLocale })}
                        component={InputFieldFF}
                        className={styles.inputField}
                        validate={composeValidators(isRequired, email)}
                        initialValue={prepopulatedFields?.email}
                        readOnly={loading || Boolean(prepopulatedFields?.email)}
                    />

                    {!emailConfigured && (
                        <ReactFinalForm.Field
                            name="phoneNumber"
                            label={i18n.t('Phone number', { lng: uiLocale })}
                            component={InputFieldFF}
                            className={styles.inputField}
                            validate={composeValidators(
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
                            hl={uiLocale}
                        />
                        {recaptchaError && <RecaptchaWarning />}
                    </AccountFormSection>
                )}
            </div>
            <ButtonStrip>
                <Button primary type="submit" disabled={loading}>
                    {loading
                        ? i18n.t('Creating...', { lng: uiLocale })
                        : i18n.t('Create account', { lng: uiLocale })}
                </Button>
                <BackToLoginButton
                    buttonText={i18n.t('Cancel', { lng: uiLocale })}
                />
            </ButtonStrip>
        </form>
    )
}

InnerCreateAccountForm.propTypes = {
    emailConfigured: PropTypes.bool,
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    prepopulatedFields: PropTypes.object,
    recaptchaError: PropTypes.bool,
    recaptchaRef: PropTypes.node,
    recaptchaSite: PropTypes.string,
    selfRegistrationNoRecaptcha: PropTypes.bool,
    uiLocale: PropTypes.string,
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
        uiLocale,
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
                                lng: uiLocale,
                                applicationName:
                                    removeHTMLTags(applicationTitle),
                            }
                        )}
                    </p>
                    {createType === CREATE_FORM_TYPES.create && (
                        <p>
                            {i18n.t('Already have an account?', {
                                lng: uiLocale,
                            })}{' '}
                            <Link to="/">
                                {i18n.t('Log in.', { lng: uiLocale })}
                            </Link>
                        </p>
                    )}
                </FormSubtitle>
            )}

            <div>
                {error && (
                    <FormNotice
                        title={i18n.t(
                            'Something went wrong, and we could not register your account',
                            { lng: uiLocale }
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
                                lng: uiLocale,
                            })}
                            valid
                        >
                            <span>
                                {i18n.t(
                                    'You can use your username and password to log in.',
                                    { lng: uiLocale }
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
                                uiLocale={uiLocale}
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
