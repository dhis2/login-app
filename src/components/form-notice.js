import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-notice.module.css'

export const FormNotice = ({ title, error, valid, children }) => (
    <div className={styles.formError}>
        <NoticeBox valid={valid} error={error} title={title}>
            {children}
        </NoticeBox>
    </div>
)

FormNotice.defaultProps = {
    error: false,
    valid: false,
}

FormNotice.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    error: PropTypes.bool,
    title: PropTypes.string,
    valid: PropTypes.bool,
}
