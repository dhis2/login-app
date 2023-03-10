import i18n from '@dhis2/d2-i18n'
import { useDataMutation } from '@dhis2/app-runtime'
import { ReactFinalForm, InputFieldFF,InputField, Button } from "@dhis2/ui";
import {
  composeValidators,
  createCharacterLengthRange,
  dhis2Password,
  dhis2Username,
  email,
  internationalPhoneNumber,
} from '@dhis2/ui-forms'
import React from "react";
import { Link } from "react-router-dom";
// import "../styles.css";
import { FormContainer } from "../components/form-container.js";
import { FormSubtitle } from "../components/form-subtitle.js";
import { useLoginConfig } from "../providers/use-login-config.js";
import { useRedirectIfNotAllowed } from "../hooks/useRedirectIfNotAllowed.js";
import { getIsRequired, removeHTMLTags } from '../helpers/index.js';

const selfRegisterMutation = {
  resource: 'auth/register',
  type: 'create',
  data: (data) => (data),
}

const XCreateAccountForm = () => {
  const {uiLocale} = useLoginConfig()
  return (
  <>
    <div>
      <AccountFormSection title={i18n.t('Log in details',{lng: uiLocale})}>
        <div style={{width: '100%'}}>
        <InputField width="90%" label={i18n.t("Username",{lng: uiLocale})} />
        </div>
        <InputField
          label={i18n.t('Password',{lng: uiLocale})}
          helpText="Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol
"
        />
      </AccountFormSection>
      <AccountFormSection title="Personal details">
        <InputField label="First name" />
        <InputField label="Last name" />
        <InputField label="Email address" />
        <InputField label="Phone number" />
        <InputField label="Employer" />
      </AccountFormSection>
      <AccountFormSection>Captcha, if applicable</AccountFormSection>
      <AccountFormActions />
    </div>
  </>
)}

const AccountFormSection = (props) => (
  <>
    <div className="account-form-section">
      {props.title && (
        <p className="account-form-section-title">{props.title}</p>
      )}
      {props.children}
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
);

const InnerCreateAccountForm = ({handleSubmit, uiLocale, loading}) => {
  const isRequired = getIsRequired(uiLocale)
  return (
  <>
  <form onSubmit={handleSubmit}>

  <div>
    <AccountFormSection title={i18n.t('Log in details',{lng: uiLocale})}>
      <ReactFinalForm.Field
        name="username"
        label={i18n.t('Username',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={composeValidators(isRequired,dhis2Username)}
        readOnly={loading}
      />
      <ReactFinalForm.Field
        name="password"
        label={i18n.t('Password',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={composeValidators(isRequired,dhis2Password)}
        type='password'
        readOnly={loading}
        helpText={i18n.t("Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol")}
      />
    </AccountFormSection>
    <AccountFormSection title={i18n.t("Personal details",{lng:uiLocale})}>
      <ReactFinalForm.Field
        name="firstName"
        label={i18n.t('First name',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={composeValidators(isRequired,createCharacterLengthRange(2,160))}
        readOnly={loading}
      />
      <ReactFinalForm.Field
        name="surname"
        label={i18n.t('Last name',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={composeValidators(isRequired,createCharacterLengthRange(2,160))}
        readOnly={loading}
      />
      <ReactFinalForm.Field
        name="email"
        label={i18n.t('Email',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={composeValidators(isRequired,email)}
        readOnly={loading}
      />
      <ReactFinalForm.Field
        name="phoneNumber"
        label={i18n.t('Phone number',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={composeValidators(isRequired,internationalPhoneNumber)}
        readOnly={loading}
      />
      <ReactFinalForm.Field
        name="employer"
        label={i18n.t('Employer',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        validate={isRequired}
        readOnly={loading}
      />      
      </AccountFormSection>    

  </div>         
  <div className="account-form-actions">
      <Button primary>{i18n.t('Create account',{lng:uiLocale})}</Button>
      <Link className='no-underline' to="/">
        <Button secondary>{i18n.t('Cancel',{lng:uiLocale})}</Button>
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

export const CreateAccountForm = ({uiLocale}) => {
  // depends on https://dhis2.atlassian.net/browse/DHIS2-14615
  const [resetPassword, {loading, fetching, error, data}] = useDataMutation(selfRegisterMutation)
  
  const handleSelfRegister = (values) => {
    console.log(values)
    resetPassword(values)
  }
  return (
    <>
    <div>
      <div>
        {error &&
          <FormNotice title={i18n.t('Something went wrong, and we could not register your account', {lng: uiLocale})} error={true}>
            <p>{error?.message}</p>
          </FormNotice>
        }
        <ReactFinalForm.Form onSubmit={handleSelfRegister}>
            {({ handleSubmit }) => <InnerCreateAccountForm handleSubmit={handleSubmit} uiLocale={uiLocale} loading={loading || fetching}/>}
        </ReactFinalForm.Form>
      </div>
    </div>
    </>

  )
}

const requiredPropsForCreateAccount = ['selfRegistrationEnabled']

const CreateAccountPage = () => {
  const {applicationTitle,uiLocale} = useLoginConfig()
  useRedirectIfNotAllowed(requiredPropsForCreateAccount)
  return (
    <>
      <FormContainer width="368px" title={i18n.t('Create account',{lng:uiLocale})}>
        <FormSubtitle>
          <p>{i18n.t('Enter your details below to create a {{- application_name}} account.',{lng:uiLocale, application_name: removeHTMLTags(applicationTitle)})}</p>
          <p>
            {i18n.t('Already have an account?',{lng:uiLocale})}{' '}
            <Link to="/">
              {i18n.t('Log in.',{lng:uiLocale})}
            </Link>
          </p>
        </FormSubtitle>
        <CreateAccountForm />
      </FormContainer>
    </>
  );
}

export default CreateAccountPage