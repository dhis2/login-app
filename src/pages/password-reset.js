import { Button, InputField,  ReactFinalForm, InputFieldFF } from "@dhis2/ui";
import { Link } from "react-router-dom";
import React from "react";
import { FormContainer } from "../components/form-container.js";
import { FormSubtitle } from "../components/form-subtitle.js";
import { FormError } from "../components/form-error.js";
import i18n from '@dhis2/d2-i18n'
import { isRequired } from "../helpers/validators.js";
import { useLoginConfig } from "../providers/use-login-config.js";

const InnerPasswordResetForm = ({handleSubmit}) => {

  return (
  <>
  <form onSubmit={handleSubmit}>

  <div>
    <ReactFinalForm.Field
      name="username"
      label={i18n.t('Username or email')}
      component={InputFieldFF}
      className={'inputField'}
      validate={isRequired}
      initialFocus
    />
  </div>         
  <div className='formButtons'>
    <Button type='submit' disabled={false} className="login-btn" primary>
      {i18n.t('Send password reset request form')}
    </Button>
    <Link to="/">
      <Button secondary className="login-btn">{i18n.t('Cancel')}</Button>
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
        .login-btn {
          width: 100%;
        }          
      `}
    </style>
  </>
)  
}

export const PasswordResetForm = () => {
  const error = null;
  const handlePasswordReset = () => {}
  return (
    <>
    <div className="form-fields">
      <div className={'styles.container'}>
        {error &&
          <FormError title={i18n.t('Incorrect username or password')} />
        }
        <ReactFinalForm.Form onSubmit={handlePasswordReset}>
            {({ handleSubmit }) => <InnerPasswordResetForm handleSubmit={handleSubmit} />}
        </ReactFinalForm.Form>
      </div>
    </div>
    </>

  )
  
}

export const PasswordResetFormContainer = () => {
  const {uiLocale} = useLoginConfig()
  
return (
  <>
    <FormContainer width="368px" title={i18n.t("Reset password",{lng: uiLocale})}>
      <FormSubtitle>
          <p>
            {i18n.t('Enter your username below, a link to reset your password will be sent to your registered e-mail.',{lng: uiLocale})}
          </p>
      </FormSubtitle>  
      <PasswordResetForm />    
      <style>
        {`
        .pw-request-form-fields {
          min-width: 320px;
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp16);
        }
        .inputs {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
          margin-bottom: var(--spacers-dp12);
        }
        .form-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
        }
        .reset-submit-btn, .reset-cancel-btn {
          width: 100%;
        }
      `}
      </style>
    </FormContainer>
  </>
)};
