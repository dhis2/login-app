import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { FormContainer } from '../components/index.js'
import { standard, sidebar } from '../templates/index.js'
import styles from './download-html.module.css'

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
        <FormContainer title={i18n.t('HTML Template Download')}>
            <div>
                <p>
                    {i18n.t(
                        'You can download the templates used by the login app here. These can be modified and reloaded as custom HTML in the settings app.'
                    )}
                </p>
                <p>{i18n.t('Refer to the documentation for more details.')}</p>
            </div>
            <div>
                <div className={styles.formButtons}>
                    <Button
                        onClick={() => {
                            downloadHTML(standard, 'standard')
                        }}
                    >
                        {i18n.t('Download default template')}
                    </Button>
                </div>
                <div className={styles.formButtons}>
                    <Button
                        onClick={() => {
                            downloadHTML(sidebar, 'sidebar')
                        }}
                    >
                        {i18n.t('Download sidebar template')}
                    </Button>
                </div>
            </div>
        </FormContainer>
    )
}

export default DownloadPage
