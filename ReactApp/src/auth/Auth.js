import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';

function Auth() {
    const navigate = useNavigate()
    const [type, setType] = useState("signIn");

    const isAuthenticated = localStorage.getItem('token') !== null;

    const handleOnClick = (text) => {
        if (text !== type) {
            setType(text);
            return;
        }
    };
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/shops')
        }


    }, [])

    const containerClass =
        "container " + (type === "signUp" ? "right-panel-active" : "");
    return (
        <div className='App'>

            <div className={containerClass} id="container">
                <Signup />
                <Login />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us, please login with your personal info</p>
                            <button
                                className="ghost"
                                id="signIn"
                                onClick={() => handleOnClick("signIn")}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start the journey with us</p>
                            <button
                                className="ghost "
                                id="signUp"
                                onClick={() => handleOnClick("signUp")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth