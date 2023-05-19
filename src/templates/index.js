export const standard = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login app</title>
    <style>
        :root {
            --form-container-background-color: white;
            --form-container-font-color: black;
            --form-container-box-shadow: var(--elevations-e400);
            --form-container-box-border-radius: 5px;
        }
		body {
		    padding: 0;
		    margin: 0;
		    background: #2a5298;
		}
		.app {
		    font-family: "Roboto", sans-serif;
		    display: flex;
		    flex-direction: column;
		    height: 100vh;
		    width: 100vw; 		    
		}
        .heading {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            align-content: top;
            flex-wrap: wrap;
            gap: 8px;
            min-height: 164px;
            padding: 24px;
        }
        .title-container {
            display: flex;
            gap: 16px;
        }
        .flag-wrapper {
          white-space: nowrap;
          display: inline;
      }
      .flag-wrapper img {
          max-height: 64px;
          width: auto;
          border: 1px solid white;
      }        
        .titles {
            max-width: 480px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .application-title-wrapper {
          font-size: 20px;
          line-height: 28px;
          color: var(--colors-grey050);
      }
      .application-description-wrapper {
          font-size: 14px;
          line-height: 19px;
          color: var(--colors-grey050);
          opacity: 0.7;
      }        

      .logo-wrapper {
        max-width: 200px;
        max-height: 120px;
        justify-items: start;
    }
    .logo-wrapper img {
        width: 100%;
    }

        .login-container {
          margin: 0 auto;
          max-width: 500px;
        }        

	    .footer {;
	      margin-top: auto;
	      display: flex;
	      align-items: center;
	      justify-content: space-between;
	      flex-wrap: wrap;
	      column-gap: 4px;
	      row-gap: 12px;
	      padding: 4px 16px;
	      border-top: 1px solid #1e3c72;
	    }
	    .footerRTL {
	        flex-direction: row-reverse;
	    }
	    .footer span {
	      font-size: 14px;
	      line-height: 19px;
	      opacity: 0.7;
	      color: #fbfcfd;
	    }
	    .footer a {
	      color: #fbfcfd;
	    }
	    .footer-left ** {
	      display: flex;
	      gap: 8px;
	    }
	    .powered-by-wrapper::after {
	      color: #1e3c72;
	      margin-left: 8px;
	      margin-right: 8px;
	      content: '|';
	      display: 'block';
	    }
	    .footer-right {
	      display: flex;
	      align-items: center;
	      gap: 8px;
	    }
	</style>
  </head>
  <body>
    <div class='app'>

      <div class='heading'>
        <div class="title-container">
          <div class='flag-wrapper'>
            <img id='flag' />
          </div>
          <div class="titles">
          <div class='application-title-wrapper'>
            <span id='application-title'></span>
          </div>
          <div class='application-description-wrapper'>
            <span id='application-description'></span>
          </div>                    
          </div>
        </div>
        <div class='logo-wrapper'>
          <img id='logo' />
        </div>
      </div>

    <div class='login-container'>
    	<div id='login-box'></div>
    </div>

    <div class='footer'>
      <div class="footer-left">
        <span class='powered-by-wrapper'>
        <span id='powered-by'></span>        
        </span>
        <span id='application-footer'></span>
      </div>
      <div class="footer-right">
        <div id='language-select'></div>
      </div>
    </div>
    </div>
  </body>
</html>
`

export const sidebar = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login app</title>
    <style>
      body {
          background-image: url("https://dhis2.org/wp-content/uploads/DHIS2-2020-conference-image.jpg");
          background-size: 1000px;
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          width: 100vw;
      }
      .sidebar-wrapper {
        display: flex;
      }
      .login-side {
        width: 450px;
        min-height: 100vh;
        background-color: #2a5298;
        display: flex;
        flex-direction: column;
      }
      .logo-container {
        display: flex;
        justify-content: center;
        margin-block-start: 16px;
        max-height: 120px;
      }
      .application-title-wrapper {
        font-size: 20px;
        margin: 16px 24px;
        color: white;
        text-align: center;
      }
      .application-description-wrapper {
        font-size: 14px;
        margin-inline-start: 24px;
        margin-inline-end: 24px;
        margin-block-end: 16px;
        color: white;
        text-align: center;
      }
      .language-select-wrapper {
        width: 250px;
        margin-inline-start: 41px;
      }
      .powered-by-wrapper {
        margin-block-start: auto;
        margin-block-end: 4px;
        margin-inline-start: 8px;
      }
      .powered-by-wrapper span {
        color: #fbfcfd;
        font-size: 14px;
      }
      .powered-by-wrapper a {
        color: #fbfcfd;
      }
    </style>
  </head>
  <body>
    <div class='sidebar-wrapper'>
      <div class='login-side'>
        <div class='logo-container'>
            <span id='logo'></span>
        </div>
        <div class='application-title-wrapper'>
            <span id='application-title'></span>
        </div>
        <div class='application-description-wrapper'>
            <span id='application-description'></span>
        </div>        
        <div id='login-box'></div>
        <div class='language-select-wrapper'>
            <div id='language-select'></div>
        </div>
        <div class='powered-by-wrapper'>
            <span id='powered-by'></span>
        </div>
      </div>

      <div class='background-side'></div>
    </div>
  </body>
</html>
`

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
