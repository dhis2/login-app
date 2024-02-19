import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useLoginConfig } from '../providers/index.js'
import styles from './application-notification.module.css'

export const ApplicationNotification = () => {
    const { applicationNotification } = useLoginConfig()
    return (
        <>
            {applicationNotification && (
                <div className={styles.appNotification}>
                    <NoticeBox>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: applicationNotification,
                            }}
                        ></span>
                    </NoticeBox>
                </div>
            )}
        </>
    )
}
