import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

export const BackToLoginButton = ({ uiLocale }) => (
    <>
        <div>
            <Link className="no-underline" to="/">
                <Button secondary>
                    {i18n.t('Back to log in page', {
                        lng: uiLocale,
                    })}
                </Button>
            </Link>
        </div>
        <style>
            {`
        .no-underline {
          text-decoration: none;
        }
      `}
        </style>
    </>
)

BackToLoginButton.defaultProps = {
    uiLocale: 'en',
}

BackToLoginButton.propTypes = {
    uiLocale: PropTypes.string,
}
