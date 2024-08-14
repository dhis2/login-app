export const standard = `
<!DOCTYPE html>
<html lang="en">
  <head>
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
		    max-width: 100%;
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
      .application-introduction-wrapper {
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
	      margin-inline-start: 8px;
	      margin-inline-end: 8px;
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
          <div class='application-introduction-wrapper'>
            <span id='application-introduction'></span>
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
        <span id='application-left-footer'></span>
      </div>
      <div class="footer-right">
        <span id='application-right-footer'></span>
        <div id='language-select'></div>
      </div>
    </div>
    </div>
  </body>
</html>
`
