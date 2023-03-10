import { NoticeBox } from "@dhis2/ui";
import React from "react";

export const FormNotice = ({title, error, valid, children}) => (
  <>
    <div className="form-error">
      <NoticeBox valid={valid} error={error} title={title}>
        {children}
      </NoticeBox>
    </div>
    <style>
      {`
        .form-error {
          margin-bottom: var(--spacers-dp8);
        }
      `}
    </style>
  </>
);

FormNotice.defaultProps = {
  error: false,
  valid: false,
}