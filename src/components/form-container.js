import PropTypes from 'prop-types'
import React from 'react'

export const FormContainer = ({ children, title, width }) => {
    return (
        <>
            <div className="form-container">
                {title && <p className="form-title">{title}</p>}
                {children}
            </div>
            <style>{`
        .form-container {
          margin: 0 auto var(--spacers-dp24) auto;
          width: ${width};
          padding: var(--spacers-dp24);
          background: var(--form-container-background-color, var(--colors-white));
          border-radius: var(--form-container-box-border-radius, 5px);
          box-shadow: var(--form-container-box-shadow, var(--elevations-e400));
        }
        .form-container span {
           color: var(--form-container-font-color, black);
        }
        .form-container a {
          color: var(--form-container-font-color, black);
       }        
        .form-title {
          font-weight: 500;
          margin: 0 0 var(--spacers-dp16);
          color: var(--form-container-title-color, var(--colors-grey900));
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
