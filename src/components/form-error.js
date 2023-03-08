import { NoticeBox } from "@dhis2/ui";
import React from "react";

export const FormError = (props) => (
  <>
    <div className="form-error">
      <NoticeBox error title={props.title}>
        {props.children}
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
