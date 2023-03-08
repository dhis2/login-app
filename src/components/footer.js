import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import React from "react";
import { useLoginConfig } from '../providers';
// import "../styles.css";

export default function Footer() {
  const { applicationFooter, refreshOnTranslation, localesUI, uiLocale} = useLoginConfig()

  return (
    <>
      <div className="footer">
        <div className="footer-left">
          <span className="powered-by">
            <a href="https://www.dhis2.org" rel="noopener noreferrer" target="_blank">
              {i18n.t('Powered by DHIS2')}
            </a>
          </span>
          {applicationFooter &&
            <span className="footer-left-content" dangerouslySetInnerHTML={{"__html": applicationFooter}}></span>
          }
          

        </div>
        <div className="footer-right">
          <SingleSelectField dense prefix="Language" selected={uiLocale ?? 'en'} onChange={({selected})=>{refreshOnTranslation({locale:selected})}}>
            {localesUI && localesUI.map(locale=>(
              <SingleSelectOption key={locale.locale} value={locale.locale} label={locale.name} />
            ))}

          </SingleSelectField>
        </div>
      </div>
      <style>
        {`
    .footer {
      margin-top: auto;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      column-gap: var(--spacers-dp4);
      row-gap: var(--spacers-dp12);
      padding: var(--spacers-dp4) var(--spacers-dp16);
      border-top: 1px solid #1e3c72;
    }
    
    .footer span {
      font-size: 14px;
      line-height: 19px;
      opacity: 0.7;
      color: var(--colors-grey050);
    }
    .footer a {
      color: var(--colors-grey050);
    }
    .footer-left ** {
      display: flex;
      gap: var(--spacers-dp8);
    }
    .footer-left-content::before {
      color: #1e3c72;
      margin-left: var(--spacers-dp8);
      margin-right: var(--spacers-dp8);
      content: '|';
      display: 'block';
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: var(--spacers-dp8);
    }
    
    `}
      </style>
    </>
  );
}
