import React, {useState} from "react"
import {NotificationManager} from 'react-notifications';
import {CometChat} from '@cometchat-pro/chat';

import config from '../config';

const Login = (props) => {
    const [uidValue, setUidValue] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        CometChat
            .login(uidValue, config.apiKey)
            .then(
                User => {
                    props.setUser(User)
                    NotificationManager.success("Logged in", "Login success")
                    console.log("Login successful:", {User})
                },
                error => {
                    setIsSubmitting(false)
                    NotificationManager.error("Please try again", "Login failed")
                    console.log("Login failed with exception:", {error})
                }
            )
    }

    return (
        <div className="row">
            <div className="col-md-6 login-form mx-auto">
                <h3>Login</h3>
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                            value={uidValue}
                            onChange={e => setUidValue(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="submit"
                            className="btn btn-primary btn-block"
                            value={`${isSubmitting ? "Loading..." : "Login"}`}
                            disabled={isSubmitting}
                        /> 
                    </div>
                </form>
            </div>
        </div>        
    )
}

export default Login