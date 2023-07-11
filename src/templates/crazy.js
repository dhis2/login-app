export const crazy = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login app</title>
    <style>
        :root {
            --form-container-background-color: bisque;
            --form-container-font-color: grey;
            --form-container-box-shadow: var(--elevations-e400);
            --form-container-box-border-radius: 5px;
            --form-container-box-border-radius: 5px;
            --application-notification-non-main-page-display: none;
        }
		body {
		    padding: 0;
		    margin: 0;
		    background: seagreen;
		}
		.app {
		    font-family: "Roboto", sans-serif;
		    display: flex;
		    height: 100vh;
		    width: 100vw; 		    
		}
    .right-side {
      margin-top: 100px;
      margin-inline-start: auto;
      margin-inline-end: 100px;

    }
    .iframe-wrapper {
      align-self: left;
    }
        .heading {
            display: flex;
            justify-content: space-between;
            align-content: top;
            flex-wrap: wrap;
            gap: 8px;
            min-height: 164px;
            padding: 24px;
        }
        .title-container {
            display: flex;
            width: 600px;
            flex-direction: column;            
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
            margin-top: 100px;
            margin-inline-start: 60px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

      .application-description-wrapper {
          font-size: 14px;
          line-height: 19px;
          color: var(--colors-grey050);
          opacity: 0.7;
      }       
      .application-footer-wrapper {
        margin-top: 16px;
        color: pink;
        font-size: 24px;
      } 

    .logo-wrapper img {
        width: 40%;
    }

        .login-container {
          display: flex;
        }
        .application-title-wrapper {
          font-size: 60px;
          line-height: 70px;
          animation: color_change 3s;
          animation-name: color_change;
          animation-duration: 10s;
          animation-iteration-count: infinite;
          animation-direction: alternate;
      }
      @keyframes color_change {
        0% { color: dodgerblue; }
        100% { color: pink; }
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

        <div class="title-container">

          <div class="titles">
          <div class='logo-wrapper'>
          <img id='logo' />
        </div>
          <div class='application-title-wrapper'>
            <span id='application-title'></span>
          </div>
          <div class='application-description-wrapper'>
            <span id='application-description'></span>
          </div>                    
          </div>
          <div class='iframe-wrapper'>
          <iframe src="https://www.yr.no/en/content/1-72837/card.html" scrolling="no" style="height: 200px; transform: scale(0.6) "> </iframe>
          </div>
          
    </div>

<div class='right-side'>
    
    <div class='login-container'>
    	<div id='login-box'></div>
    </div>
    <div id='language-select'></div>



      <div class='application-footer-wrapper'>
        <span id='application-footer'></span>
        </div>

    </div>
    </div>
    </div>
  </body>
</html>
`
