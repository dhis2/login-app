import i18n from '@dhis2/d2-i18n'
import { 
  ReactFinalForm,
  InputFieldFF,
  Button } from "@dhis2/ui";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from 'react-final-form'
import { Link } from "react-router-dom";
import { FormContainer } from "../components/form-container.js";
import { FormError } from "../components/form-error.js";
import { FormSubtitle } from "../components/form-subtitle.js";
import {ApplicationNotification} from '../components/application-notification'
import useLogin from '../hooks/useLogin'
import { useLoginConfig } from '../providers/use-login-config.js';
import { isRequired } from '../helpers/validators.js';

export default function LoginPage() {
  return (
    <>
      <LoginFormContainer />
      <ApplicationNotification />
    </>
  );
}
const genericUser = 'some person'

const Links = () => (
  <>
  <div className="links">
  <span>
    <Link to="/reset-password">
      <a href="#">{i18n.t('Forgot password?')}</a>
    </Link>
  </span>
  <span>
    {i18n.t("Don't have an account?")}{" "}
    <Link to="/create-account">
      <a href="#">{i18n.t('Create an account')}</a>
    </Link>
  </span>
  </div>
    <style>
    {`
      .links {
        display: flex;
        flex-direction: column;
        gap: var(--spacers-dp8);
      }
      .links span,
      .links a {
        color: var(--colors-grey900);
        font-size: 14px;
      }
    `}
  </style>
  </>
)

const InnerLoginForm = ({handleSubmit, twoFAVerificationRequired, cancelTwoFA, uiLocale, loading}) => {
  const form = useForm()
  const ref = useRef()
  const clearTwoFA = () => {
    form.change('password', undefined)
    form.change('twoFA', undefined)
    form.focus()
    cancelTwoFA()
    ref?.current?.focus()
  }
  const loginButtonText = twoFAVerificationRequired ? i18n.t('Verify and log in',{lng: uiLocale}) : i18n.t('Log in',{lng:uiLocale})

return (
  <>
  <form onSubmit={handleSubmit}>

  <div className={twoFAVerificationRequired ? 'hiddenFields' : ''}>
    <ReactFinalForm.Field
      name="username"
      label={i18n.t('Username')}
      
      component={InputFieldFF}
      className={'inputField'}
      initialValue={genericUser}
      validate={(val)=>!val? i18n.t('This field is required',{lng:uiLocale}): null}
      initialFocus={!twoFAVerificationRequired}
      onBlur={(e)=>{console.log(e.value)}}
      readOnly={loading}
    />
    <ReactFinalForm.Field
      name="password"
      label={i18n.t('Password', {lng: uiLocale})}
      type='password'
      component={InputFieldFF}
      className={'inputField'}
      initialValue=''
      validate={isRequired}
      readOnly={loading}
    />
  </div>         



  <div className={!twoFAVerificationRequired ? 'hiddenFields' : ''}>
      <ReactFinalForm.Field
        name="twoFA"
        label={i18n.t('Authentication code',{lng: uiLocale})}
        component={InputFieldFF}
        className={'inputField'}
        initialValue=''
        initialFocus={twoFAVerificationRequired}
        readOnly={loading}
      />      
  </div>
    <div className='formButtons'>
    <Button type='submit' disabled={loading} className="login-btn" primary>
      {loading ? i18n.t('Logging in',{lng: uiLocale}) : loginButtonText }
    </Button>
    {twoFAVerificationRequired &&
    <Button secondary disabled={loading} onClick={clearTwoFA} className="login-btn">{i18n.t('Cancel',{lng: uiLocale})}</Button>
    }
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

InnerLoginForm.defaultProps = {
  uiLocale: 'en',
}

const LoginForm = ({setTwoFAVerificationRequired, uiLocale}) => {

  const {login, cancelTwoFA, twoFAVerificationRequired, error, loading} = useLogin({redirectTo:'http://www.dhis2.org'})

  useEffect(()=>{    
    if (setTwoFAVerificationRequired) {
      setTwoFAVerificationRequired(twoFAVerificationRequired)
    }
      
  },[twoFAVerificationRequired, setTwoFAVerificationRequired])

  if (!login) {
    return null
  }
  const handleLogin = (values) => {
    login({"language":values.username})
  }

  return (
    <>
    <div className="form-fields">
      <div className={'styles.container'}>
        {error &&
          <FormError title={i18n.t('Incorrect username or password', {lng: uiLocale})} />
        }
        <ReactFinalForm.Form onSubmit={handleLogin}>
            {({ handleSubmit }) => <InnerLoginForm handleSubmit={handleSubmit} twoFAVerificationRequired={twoFAVerificationRequired} cancelTwoFA={cancelTwoFA} uiLocale={uiLocale} loading={loading}/>}
        </ReactFinalForm.Form>
      </div>
    </div>
    </>

  )
}

LoginForm.defaultProps = {
  uiLocale: 'en',
}

// this is set up this way to isolate styling from login form logic
const LoginFormContainer = () => {

  const [twoFAVerificationRequired, setTwoFAVerificationRequired] = useState(false)
  const {uiLocale} = useLoginConfig()

  return (
  <FormContainer width="368px" title={twoFAVerificationRequired ? i18n.t('Two-factor authentication',{lng:uiLocale}) : i18n.t('Log in',{lng:uiLocale})}>
    {twoFAVerificationRequired && (
    <FormSubtitle>
        <p>
          {i18n.t('Enter the code from your two-factor authentication app to log in.',{lng: uiLocale})}
        </p>
    </FormSubtitle>) }
    <LoginForm setTwoFAVerificationRequired={setTwoFAVerificationRequired} uiLocale={uiLocale} />
    {!twoFAVerificationRequired &&
    <Links />
    }    
    <style>
      {`
        .form-fields {
          min-width: 320px;
          display: flex;
          flex-direction: column;
        }
        .inputs {
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
          margin-bottom: var(--spacers-dp12);
        }
      `}
    </style>
  </FormContainer>
)};
