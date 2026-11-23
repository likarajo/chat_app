// CometChat credentials come from environment variables (see .env.example).
// Create React App inlines REACT_APP_* values at build time.
const config = {
    appID: process.env.REACT_APP_COMETCHAT_APP_ID,
    apiKey: process.env.REACT_APP_COMETCHAT_API_KEY,
    region: process.env.REACT_APP_COMETCHAT_REGION || 'US'
}

export default config
