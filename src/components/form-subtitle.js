import React from "react";

export const FormSubtitle = (props) => {
  return (
    <>
      <div className="form-subtitle">{props.children}</div>
      <style>
        {`
    .form-subtitle {
      font-size: 14px;
      line-height: 17px;
      color: var(--colors-grey700);
      margin-bottom: var(--spacers-dp16);
    }
    .form-subtitle p {
      margin: 0 0 var(--spacers-dp8);
    }
    .form-subtitle a {
      color: var(--colors-grey700);
    }
    `}
      </style>
    </>
  );
};
