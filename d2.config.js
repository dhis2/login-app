const config = {
    id: '88723e2b-aec4-4051-87a5-12e06e9446ae',
    type: 'login_app',
    name: 'login',
    title: 'Login',
    description: 'Core app for the login page of DHIS2',
    coreApp: true,
    minDHIS2Version: '2.41',
    entryPoints: {
        app: './src/app.jsx',
    },
}

module.exports = config
