export const sidebar = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Login app</title>
		<style>
      :root {
        --form-container-default-width: 420px;
        --form-container-margin-block-start: 32px;
        --form-container-margin-block-end: 8px;
        --form-container-margin-inline-start: 48px;
        --form-container-margin-inline-end: 48px;
        --form-container-padding: 0px;
        --form-container-background-color: white;
        --form-container-font-color: black;
        --form-container-box-shadow: 0;
        --form-container-box-border-radius: 0px;
        --form-title-font-size: 30px;
        --form-title-font-weight: 400;
        --form-button-direction: 'row';
      }    
      body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
      }

      .wrapper {
        display: flex;
      }

      .sidebar {
        width: 450px;
        min-height: 100vh;
        background: linear-gradient(180deg, #2A5298 0%, #1E3C72 100%);
        display: flex;
        flex-direction: column;
      }

      .flag-wrapper {
        white-space: nowrap;
        display: inline;
        margin: 24px;
        justify-content: flex-start;
      }

      .flag-wrapper img {
        max-height: 64px;
        width: auto;
        border: 1px solid white;
      }      

      .logo-wrapper {
        margin-inline-start: 24px;
        padding-block: 24px;
        margin-block-start: auto;
        max-height: 120px;
      }

      .application-title-wrapper {
        font-size: 32px;
        font-weight: 400;
        margin: 16px 24px;
        color: white;
      }

      .application-description-wrapper {
        font-size: 14px;
        margin-inline-start: 24px;
        margin-inline-end: 24px;
        margin-block-end: 16px;
        color: white;
      }

      .main-content {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-flow: column;
      }

      .language-select-wrapper {
        width: 100%;
        padding: 24px;
        display: flex;
        justify-content: flex-end;
        background-color: white;
      }

      .login-box-wrapper {        
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: white;  
      }

      .powered-by-wrapper {
        margin-block-start: auto;
        margin-block-end: 4px;
        margin-inline-start: 8px;
      }

	    .footer {
	      display: flex;
	      align-items: center;
	      justify-content: space-between;
	      flex-wrap: wrap;
	      column-gap: 4px;
	      row-gap: 12px;
	      padding: 8px 16px;
	      border-top: 1px solid #1e3c72;
        background-color: white;        
	    }
	    .footerRTL {
	        flex-direction: row-reverse;
	    }
	    .footer span {
	      font-size: 14px;
	      line-height: 19px;
	      opacity: 0.7;
	      color: grey;
	    }
	    .footer a {
	      color: grey;
	    }
	    .footer-left ** {
	      display: flex;
	      gap: 8px;
	    }

      .powered-by-wrapper span {
        color: grey;
        font-size: 14px;
      }

      .powered-by-wrapper a {
        color: grey;
      }      
    </style>
	</head>
	<body>
		<div class='wrapper'>
			<div class='sidebar'>
				<div class='flag-wrapper'>
					<span id='flag'></span>
				</div>
				<div class='application-title-wrapper'>
					<span id='application-title'></span>
				</div>
				<div class='application-description-wrapper'>
					<span id='application-description'></span>
				</div>
				<div class='logo-wrapper'>
					<span id='logo'></span>
				</div>
			</div>
			<div class='main-content'>
				<div class='language-select-wrapper'>
					<div id='language-select'></div>
				</div>
				<div class='login-box-wrapper'>
					<div id='login-box'></div>
				</div>
				<div class='footer'>
					<div >
						<span class='powered-by-wrapper'>
							<span id='powered-by'></span>
						</span>
						<span id='application-left-footer'></span>
					</div>
					<div class="footer-right">
						<span id='application-right-footer'></span>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
`
