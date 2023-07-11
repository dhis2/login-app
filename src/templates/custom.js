export const custom = `
<!DOCTYPE html>
<html lang="en">

  <head>
    <title>Login app</title>
    <style>
      :root {
        --form-container-background-color: #B4A269;
        --form-container-font-color: green;
        --form-container-title-color: white;
        --form-container-box-shadow: '0px 0px 0px rgba(33,41,52,0.06), 0px 0px 0px rgba(33,41,52,0.1)',
        --form-container-box-border-radius: 0px;
        --application-notification-non-main-page-display: none;
      }

      body {
        background-color: #B4A269;
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        height: 100vh;
      }

      .main {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .heading {
        max-height: 120px;
        margin: 8px;
        width: calc(100% - 16px);
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between; 
      }

      .flag-wrapper {
        white-space: nowrap;
        display: inline;
        padding: 4px;
        justify-content: flex-start;
      }

      .flag-wrapper img {
        max-height: 64px;
        width: auto;
      }

      .titles-wrapper {
        padding: 16px;
        justify-content: center;
      }

      .titles-wrapper * {
        text-align: center;
        color: #7e480a;
      }

      .application-title-wrapper {
        font-size: 24px;
        font-weight: 700;
      }

      .application-description-wrapper {
        margin-block-start: 8px;
        font-size: 14px;
      }

      .logo-wrapper {
        max-width: 200px;
        max-height: 120px;
        display: inline;
        padding-inline-end: 4px;
      }

      .logo-wrapper img {
        width: 100%;
        filter: invert(60%) sepia(80%);
      }

      .logo-main-wrapper {
        max-height: 80px;
        margin: 8px auto;
      }

      .login-box-wrapper {
        max-width: 500px;
        margin: 8px auto;
      }

      .footer {
        margin-top: auto;
        width: 100px;
        width: 100%;
        padding: 8px;
        font-size: 16px;
        border-top: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .footer-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .hidden {
        visibility: hidden;
      }

      .links-wrapper {
        display: flex;
        padding: 8px;
        margin: 8px auto;
      }

      .links-wrapper div {
        padding-inline-end: 16px;
      }

      .links-wrapper a {
        color: black;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <div class='main'>
      <div class='heading'>

        <div class='flag-wrapper'>
          <a href='https://www.norge.no'>
            <span id='flag'>
           </a>
      </div>      
      <div class='titles-wrapper'>
      <div class='application-title-wrapper'><span id='application-title'></span>
        </div>
        <div class='application-description-wrapper'><span id='application-description'></span></div>

      </div>
      <div class='logo-wrapper'>
        <img id='logo'></img>
      </div>
    </div>
    <div class='logo-main-wrapper'>
      <img id='logo'></img>
    </div>

    <div class='login-box-wrapper'>
      <div id='login-box'></div>
    </div>
    <div class='links-wrapper'>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-bar-graph" viewBox="0 0 16 16">
          <path d="M4.5 12a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1zm3 0a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1zm3 0a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1z" />
          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
        </svg>
        <a href='https://www.dhis2.org'>some charts link</a>
      </div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
          <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
        </svg>
        <a href='https://www.dhis2.org'>some film link</a>
      </div>
    </div>

    <div class='footer'>
      <div>
        <span id='application-footer'></span>
      </div>
      <div class='footer-right'>
        <span>Africa CDC</span>
        <div id='language-select'></div>
      </div>
    </div>
    </div>
  </body>
</html>
`
