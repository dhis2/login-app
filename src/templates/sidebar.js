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
