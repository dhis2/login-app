export const custom = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login app</title>
    <style>
        :root {
            --form-container-background-color: #B4A269;
            --form-container-font-color: white;
            --form-container-title-color: white;
            --form-container-box-shadow: '0px 0px 0px rgba(33,41,52,0.06), 0px 0px 0px rgba(33,41,52,0.1)',
            --form-container-box-border-radius: 0px;
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
      <div class='application-title-wrapper'><span id='application-title'></span></div>
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
