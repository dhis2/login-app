import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { convertHTML } from '../helpers/index.js'
import { useLoginConfig } from '../providers/index.js'

const PopupContents = ({ popupHTML }) => {
    const [popupOpen, setPopupOpen] = useState(true)
    const closePopup = useCallback(() => {
        setPopupOpen(false)
    }, [setPopupOpen])
    if (!popupOpen) {
        return null
    }
    return (
        <Modal large position="middle">
            <ModalContent>{convertHTML(popupHTML)}</ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={closePopup} primary>
                        {i18n.t('I agree')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

PopupContents.propTypes = {
    popupHTML: PropTypes.string,
}

export const Popup = () => {
    const { loginPopup } = useLoginConfig()
    if (!loginPopup?.length) {
        return null
    }
    return <PopupContents popupHTML={loginPopup} />
}
