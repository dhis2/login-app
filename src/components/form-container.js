import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-container.module.css'

export const FormContainer = ({ children, title, variableWidth }) => (
    <div
        className={
            variableWidth
                ? styles.formContainerVariableWidth
                : styles.formContainer
        }
    >
        {title && <h3 className={styles.formTitle}>{title}</h3>}
        {children}
    </div>
)

FormContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    title: PropTypes.string,
    variableWidth: PropTypes.bool,
}
