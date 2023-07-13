import { useLoginSettings } from '@dhis2/app-runtime'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
// import { useLoginForm } from '../login-form-provider/index.js'

export const ApplicationNotification = () => {
    const { applicationNotification } = useLoginSettings()

    if (!applicationNotification || applicationNotification === '') {
        return null
    }

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
