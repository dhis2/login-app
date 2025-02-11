import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-subtitle.module.css'

export const FormSubtitle = ({ children }) => {
    return <div className={styles.formSubtitle}>{children}</div>
}

FormSubtitle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
}
