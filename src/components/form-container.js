import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-container.module.css'

export const FormContainer = ({ children, title, width }) => (
    <div style={width ? { width: `${width}` } : null}>
        <div className={styles.formContainer}>
            {title && <p className={styles.formTitle}>{title}</p>}
            {children}
        </div>
    </div>
)

FormContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    title: PropTypes.string,
    width: PropTypes.string,
}
