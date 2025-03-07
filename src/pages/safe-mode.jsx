import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useLoginConfig } from '../providers/index.js'

const SAFE_MODE_ENDPOINT = 'dhis-web-commons/security/login.action'

const SafeModePage = () => {
    const { baseUrl, lngs } = useLoginConfig()
    const safeURL = `${baseUrl}/${SAFE_MODE_ENDPOINT}`

    useEffect(() => {
        window.location.href = `${baseUrl}/${SAFE_MODE_ENDPOINT}`
    }, [baseUrl])

    return (
        <>
            <p>
                {i18n.t(
                    'You should shortly be redirected. If you are not redirected, please click redirect button.',
                    { lngs }
                )}
            </p>
            <div>
                <a rel="noopener noreferrer" href={safeURL}>
                    <Button>Redirect</Button>
                </a>
            </div>
        </>
    )
}

export default SafeModePage
