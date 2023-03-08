import { InputField, Button } from "@dhis2/ui";
import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";
import { FormContainer } from "../components/form-container.js";
import { FormSubtitle } from "../components/form-subtitle.js";

export default function CreateAccount() {
  return (
    <>
      <FormContainer width="70%" title="Create account">
        <FormSubtitle>
          <p>Enter your details below to create a application-title account.</p>
          <p>
            Already have an account?{" "}
            <Link to="/">
              <a href="#">Log in</a>
            </Link>
          </p>
        </FormSubtitle>
        <CreateAccountForm />
      </FormContainer>
    </>
  );
}

const CreateAccountForm = () => (
  <>
    <div className="create-account-form">
      <AccountFormSection title="Log in details">
        <InputField label="Username" />
        <InputField
          label="Password"
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
);

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

const AccountFormActions = () => (
  <>
    <div className="account-form-actions">
      <Button primary>Create account</Button>
      <Link to="/">
        <Button secondary>Cancel</Button>
      </Link>
    </div>
    <style>
      {`
.account-form-actions {
  display: flex;
  gap: var(--spacers-dp8);
}
`}
    </style>
  </>
);
