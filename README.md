# Chat App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It utilizes the npm module to connect to the [CometChat sandbox](https://app.cometchat.com/) back-end for transmitting messages in real-time.

## NPM modules

```
npm install 
    @cometchat-pro/chat 
    bootstrap 
    react-md-spinner 
    react-notifications
```

## Run Locally

* Run `npm install`
* Sign up for *CometChat PRO* and create your application
    * Create an ApiKey
* Copy `.env.example` to `.env` and set `REACT_APP_COMETCHAT_APP_ID`, `REACT_APP_COMETCHAT_API_KEY` and `REACT_APP_COMETCHAT_REGION`. Never commit `.env`, which is git-ignored.
    * Create React App bundles these values into the browser build, so use a CometChat key meant for client-side use. Don't use a server or REST API key.
* Run `npm start`
* A browser will open at *localhost:3000*
