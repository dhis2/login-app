import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm, InputFieldFF, Button } from '@dhis2/ui'
import {
    composeValidators,
    createCharacterLengthRange,
    dhis2Password,
    dhis2Username,
    email,
    internationalPhoneNumber,
} from '@dhis2/ui-forms'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
// import "../styles.css";
import { FormContainer } from '../components/form-container.js'
import { FormNotice } from '../components/form-notice.js'
import { FormSubtitle } from '../components/form-subtitle.js'
import { getIsRequired, removeHTMLTags } from '../helpers/index.js'
import { useRedirectIfNotAllowed } from '../hooks/useRedirectIfNotAllowed.js'
import { useLoginConfig } from '../providers/use-login-config.js'

const selfRegisterMutation = {
    resource: 'auth/register',
    type: 'create',
    data: (data) => data,
}

const AccountFormSection = ({ children, title }) => (
    <>
        <div className="account-form-section">
            {title && <p className="account-form-section-title">{title}</p>}
            {children}
        </div>
        <style>
            {`
      .account-form-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacers-dp8);
        margin-bottom: var(--spacers-dp24);
      }
      .account-form-section-title {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--colors-grey900);
      }
      `}
        </style>
    </>
)

AccountFormSection.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    title: PropTypes.string,
}

const InnerCreateAccountForm = ({ handleSubmit, uiLocale, loading }) => {
    const isRequired = getIsRequired(uiLocale)
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <AccountFormSection
                        title={i18n.t('Log in details', { lng: uiLocale })}
                    >
                        <ReactFinalForm.Field
                            name="username"
                            label={i18n.t('Username', { lng: uiLocale })}
                            component={InputFieldFF}
                            className={'inputField'}
                            validate={composeValidators(
                                isRequired,
                                dhis2Username
                            )}
                            readOnly={loading}
                        />
                        <ReactFinalForm.Field
                            name="password"
                            label={i18n.t('Password', { lng: uiLocale })}
                            component={InputFieldFF}
                            className={'inputField'}
                            validate={composeValidators(
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
                        title={i18n.t('Personal details', { lng: uiLocale })}
                    >
                        <ReactFinalForm.Field
                            name="firstName"
                            label={i18n.t('First name', { lng: uiLocale })}
                            component={InputFieldFF}
                            className={'inputField'}
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
                            className={'inputField'}
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
                            className={'inputField'}
                            validate={composeValidators(isRequired, email)}
                            readOnly={loading}
                        />
                        <ReactFinalForm.Field
                            name="phoneNumber"
                            label={i18n.t('Phone number', { lng: uiLocale })}
                            component={InputFieldFF}
                            className={'inputField'}
                            validate={composeValidators(
                                isRequired,
                                internationalPhoneNumber
                            )}
                            readOnly={loading}
                        />
                        <ReactFinalForm.Field
                            name="employer"
                            label={i18n.t('Employer', { lng: uiLocale })}
                            component={InputFieldFF}
                            className={'inputField'}
                            validate={isRequired}
                            readOnly={loading}
                        />
                    </AccountFormSection>
                    <AccountFormSection>
                        Captcha, if applicable
                    </AccountFormSection>
                </div>
                <div className="account-form-actions">
                    <Button primary type="submit" disabled={loading}>
                        {loading
                            ? i18n.t('Creating...', { lng: uiLocale })
                            : i18n.t('Create account', { lng: uiLocale })}
                    </Button>
                    <Link className="no-underline" to="/">
                        <Button secondary disabled={loading}>
                            {i18n.t('Cancel', { lng: uiLocale })}
                        </Button>
                    </Link>
                </div>
            </form>
            <style>
                {`
        .inputField {
          margin-bottom: var(--spacers-dp8);
        }
        .hiddenFields {
          display:none;
        }
        .formButtons {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);          
          margin-bottom: var(--spacers-dp16);
        }
        .reset-btn {
          width: 100%;
        }
        .no-underline {
          text-decoration: none;
        }
        .account-form-actions {
          display: flex;
          gap: var(--spacers-dp8);          
        }
        .no-underline {
          text-decoration: none;
        }
      `}
            </style>
        </>
    )
}

InnerCreateAccountForm.propTypes = {
    handleSubmit: PropTypes.func,
    loading: PropTypes.bool,
    uiLocale: PropTypes.string,
}

export const CreateAccountForm = () => {
    // depends on https://dhis2.atlassian.net/browse/DHIS2-14615
    const { applicationTitle, uiLocale, emailConfigured } = useLoginConfig()
    const [resetPassword, { loading, fetching, error, data }] =
        useDataMutation(selfRegisterMutation)

    const handleSelfRegister = (values) => {
        resetPassword(values)
    }
    return (
        <>
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
                        <p>
                            {i18n.t('Already have an account?', {
                                lng: uiLocale,
                            })}{' '}
                            <Link to="/">
                                {i18n.t('Log in.', { lng: uiLocale })}
                            </Link>
                        </p>
                    </FormSubtitle>
                )}

                <div>
                    {data && (
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
                    {error && (
                        <>
                            {emailConfigured && (
                                <FormNotice
                                    title={i18n.t('Verify your email address', {
                                        lng: uiLocale,
                                    })}
                                >
                                    <span>
                                        {i18n.t(
                                            'Check your email for a link to verify your email address and finish setting up your account.',
                                            { lng: uiLocale }
                                        )}
                                    </span>
                                </FormNotice>
                            )}
                            {!emailConfigured && (
                                <FormNotice
                                    title={i18n.t(
                                        'Account created successfully',
                                        {
                                            lng: uiLocale,
                                        }
                                    )}
                                    valid
                                >
                                    <span>
                                        {i18n.t(
                                            'You can use your username and password to log in.',
                                            { lng: uiLocale }
                                        )}
                                    </span>
                                </FormNotice>
                            )}

                            <Link className="no-underline" to="/">
                                <Button secondary>
                                    {i18n.t('Back to log in page', {
                                        lng: uiLocale,
                                    })}
                                </Button>
                            </Link>
                        </>
                    )}
                    {!error && (
                        <ReactFinalForm.Form onSubmit={handleSelfRegister}>
                            {({ handleSubmit }) => (
                                <InnerCreateAccountForm
                                    handleSubmit={handleSubmit}
                                    uiLocale={uiLocale}
                                    loading={loading || fetching}
                                />
                            )}
                        </ReactFinalForm.Form>
                    )}
                </div>
            </div>
            <style>
                {`
        .no-underline {
          text-decoration: none;
        }    
      `}
            </style>
        </>
    )
}

const requiredPropsForCreateAccount = ['selfRegistrationEnabled']

const CreateAccountPage = () => {
    const { uiLocale } = useLoginConfig()
    useRedirectIfNotAllowed(requiredPropsForCreateAccount)
    return (
        <>
            <FormContainer title={i18n.t('Create account', { lng: uiLocale })}>
                <CreateAccountForm />
            </FormContainer>
        </>
    )
}

export default CreateAccountPage
