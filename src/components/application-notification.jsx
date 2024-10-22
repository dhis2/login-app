import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { convertHTML } from '../helpers/handleHTML.js'
import { useLoginConfig } from '../providers/index.js'
import styles from './application-notification.module.css'

export const ApplicationNotification = () => {
    const { applicationNotification } = useLoginConfig()
    return (
        <>
            {applicationNotification && (
                <div className={styles.appNotification}>
                    <NoticeBox>
                        <span>{convertHTML(applicationNotification)}</span>
                    </NoticeBox>
                </div>
            )}
        </>
    )
}
