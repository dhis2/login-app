import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { FormContainer } from '../components/index.js'
import { standard, sidebar } from '../templates/index.js'

const downloadHTML = (htmlString, htmlName) => {
    const blob = htmlString
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${htmlName}.html`)

    document.body.appendChild(link)

    link.click()

    link.parentNode.removeChild(link)
}

const DownloadPage = () => {
    return (
        <FormContainer>
            <div>
                <p>
                    {i18n.t(
                        'Download the HTML templates used for the login app'
                    )}
                </p>
                <p>
                    {i18n.t(
                        'If you upload a custom template in the settings app, your template must include the following element `<div id="loginBox" />`'
                    )}
                </p>
                <p>{i18n.t('Refer to documentation for more details.')}</p>
            </div>
            <ButtonStrip>
                <Button
                    onClick={() => {
                        downloadHTML(standard, 'standard')
                    }}
                >
                    {i18n.t('Download default template')}
                </Button>
                <Button
                    onClick={() => {
                        downloadHTML(sidebar, 'sidebar')
                    }}
                >
                    {i18n.t('Download sidebar template')}
                </Button>
            </ButtonStrip>
        </FormContainer>
    )
}

export default DownloadPage
