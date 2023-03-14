import PropTypes from 'prop-types'
import React from 'react'

export const FormSubtitle = ({ children }) => {
    return (
        <>
            <div className="form-subtitle">{children}</div>
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
    )
}

FormSubtitle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
}
