import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setState({
            ...state,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleOnSubmit = async (evt) => {
        evt.preventDefault();
        let valid = true;
        const newErrors = {
            email: "",
            password: "",
        };

        if (!state.email || !validateEmail(state.email)) {
            newErrors.email = "Please enter a valid email address.";
            valid = false;
        }

        if (!state.password) {
            newErrors.password = "Password is required.";
            valid = false;
        }

        if (!valid) {
            setErrors(newErrors);
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(state),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data)
                localStorage.setItem('token', data.token)
                navigate('/shops')
                setState({
                    email: "",
                    password: "",
                });
            } else {

                alert(data.message);
            }


        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Sign in</h1>
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <div className="error-message">{errors.email}</div>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                />
                <div className="error-message">{errors.password}</div>
                <button className="my-3 pointer">Sign In</button>
            </form>
        </div>
    );
}

export default Login;
