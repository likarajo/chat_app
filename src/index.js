import React from "react"
import ReactDOM from "react-dom"

import {CometChat} from "@cometchat-pro/chat"

import config from "./config"
import App from "./components/App"

CometChat.init(config.appID)

ReactDOM.render(<App />, document.getElementById("root"))