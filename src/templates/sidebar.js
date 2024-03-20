export const sidebar = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<style>
      :root {
        --form-container-padding: 0px;
        --form-container-background-color: white;
        --form-container-font-color: black;
        --form-container-box-shadow: 0;
        --form-container-box-border-radius: 0px;
        --form-title-font-weight: 400;
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
        min-height: 100vh;              
        display: flex;
        justify-content: center;
      }

      .sidebar-inner {
        display: flex;
        flex-direction: column;
      }

      .top-elements {
        display: flex;
        justify-content: flex-start;
        margin-block: 16px;
      }

      .flag-wrapper {
        white-space: nowrap;
        display: inline;
        justify-content: flex-start;
        margin-inline-end: 24px;
      }

      .flag-wrapper img {
        max-height: 64px;
        width: auto;
        border: 1px solid white;
      }      

      .application-title-wrapper {
        font-size: 28px;
        font-weight: 400;

      }

      .application-introduction-wrapper {
        font-size: 16px;
        margin-block-start: 8px;
        margin-block-end: 32px;
      }

      .main-content {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-flow: column;
        background: linear-gradient(180deg, #2A5298 0%, #1E3C72 100%);
      }

      .language-select-wrapper {
        width: 100%;
        margin-block: 8px;
        display: flex;
        justify-content: flex-start;
      }

      .login-box-wrapper {        
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .footer-items * {
        margin-block: 8px;
      }

      @media screen and (min-width: 420px) {
        .sidebar {
          min-width: 420px;
        }
      }

      @media screen and (max-width: 420px) {
        .main-content {
          display: none;
        }
        .sidebar {
          padding: 8px;
        }
      }

    </style>
	</head>
	<body>
		<div class='wrapper'>
			<div class='sidebar'>
				<div class='sidebar-inner'>
					<div class='top-elements'>
						<div class='flag-wrapper'>
							<span id='flag'></span>
						</div>
						<span id='logo'></span>
					</div>
					<div class='sidebar-element'>
						<div class='application-title-wrapper'>
							<span id='application-title'></span>
						</div>
						<div class='application-introduction-wrapper'>
							<span id='application-introduction'></span>
						</div>
					</div>
					<div class='login-box-wrapper'>
						<div id='login-box'></div>
					</div>
					<div class='footer-items'>
						<div>
							<div id='powered-by'></div>
						</div>
						<div>
							<div id='application-right-footer'></div>
						</div>
						<div>
							<div id='application-left-footer'></div>
						</div>
					</div>
					<div class='language-select-wrapper'>
						<div id='language-select'></div>
					</div>
				</div>
			</div>
			<div class='main-content'></div>
		</div>
	</body>
</html>
`
