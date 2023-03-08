import React from "react";
import { useLoginConfig } from "../providers";

export default function Header() {
  const {applicationDescription, applicationTitle, countryFlag, loginPageLogo, useCountryFlag, useLoginPageLogo} = useLoginConfig()
  return (
    <>
      <div className="heading">
        <div className="title-container">
          {useCountryFlag && countryFlag &&
            <ExampleFlag flagSource="http://localhost:8080/dhis-web-commons/flags/norway.png" />
          }
          
          <div className="titles">
            {applicationTitle &&
              <span className="app-title" dangerouslySetInnerHTML={{"__html": applicationTitle}}></span>
            }
            {applicationDescription &&
              <span className="app-description" dangerouslySetInnerHTML={{"__html": applicationDescription}}></span>
            }                                  
          </div>
        </div>
        {useLoginPageLogo && loginPageLogo &&
          <ExampleLogo loginLogoSource={loginPageLogo}/>
        }        
      </div>
      <style jsx>{`
        .heading {
          display: flex;           
          justify-content: space-between;
          align-items: stretch;
          align-content: top;
          flex-wrap: wrap;        
          gap: var(--spacers-dp8);
          min-height: 164px;
          padding: var(--spacers-dp24);          
        }
        .title-container {
          display: flex;
          gap: var(--spacers-dp16);
        }
        .flag {
          height: 64px;
          max-height: 64px;
          max-width: 96px;
          flex-shrink: 0;
        }
        .titles {
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: var(--spacers-dp8);
        }
        .app-title {
          font-size: 20px;
          line-height: 28px;
          color: var(--colors-grey050);
        }
        .app-description {
          font-size: 14px;
          line-height: 19px;
          color: var(--colors-grey050);
          opacity: 0.7;
        }
      `}</style>
    </>
  );
}

// if nepal, need to have no border
const ExampleFlag = ({flagSource}) => (
  <>
    <div className="flag">
    <img src={flagSource} alt="logo" />
    </div>
    <style jsx>{`
        .flag {
          white-space:nowrap;
          display:inline;
        }
        .flag img {
          max-height: 64px;
          width: auto;
          border: 1px solid white;
        }
      `}</style>
  </>  
)

const ExampleLogo = ({loginLogoSource}) => (
  <>
    <div className="logo">
    <img src={loginLogoSource} alt="logo" />
    </div>
    <style jsx>{`
        .logo {
          max-width: 200px;
          max-height: 120px;
          justify-items: start;
        }
        .logo img {
          width: 100%;
        }
      `}</style>
  </>
);
