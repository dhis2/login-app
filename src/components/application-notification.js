import { NoticeBox } from '@dhis2/ui'
import React from 'react'
// import { useLoginForm } from '../login-form-provider/index.js'
import { useLoginConfig } from '../providers'

export const ApplicationNotification = () => {
    const { applicationNotification } = useLoginConfig()
    return (
        <>
            {applicationNotification && (
                <div className="app-notification">
                    <NoticeBox>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: applicationNotification,
                            }}
                        ></span>
                    </NoticeBox>
                </div>
            )}
            <style>
                {`
            .app-notification {
              margin: 0 auto var(--spacers-dp24);
              max-width: 368px;
            }
          `}
            </style>
        </>
    )
}
