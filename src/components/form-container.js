import PropTypes from 'prop-types'
import React from 'react'

export const FormContainer = ({ children, title, width }) => {
    return (
        <>
            <div className="form-container">
                <p className="form-title">{title}</p>
                {children}
            </div>
            <style>{`
        .form-container {
          margin: 0 auto var(--spacers-dp24);
          width: ${width};
          padding: var(--spacers-dp24);
          background: var(--colors-white);
          border-radius: 5px;
          box-shadow: var(--elevations-e400);
        }
        .form-title {
          font-weight: 500;
          margin: 0 0 var(--spacers-dp16);
          color: var(--colors-grey900);
        }
      `}</style>
        </>
    )
}

FormContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    title: PropTypes.string,
    width: PropTypes.string,
}
