// Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate()
    const [state, setState] = useState({
        email: "",
        password: "",
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
        // Basic email validation
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
        } else if (state.password.length < 6) {
            newErrors.password = "Password must be atlist 6 charecters.";
            valid = false;
        }

        if (!valid) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(state),
            });

            const data = await response.json();
            // If signup is successful, you can perform additional actions here
            if (response.ok) {
                setState({
                    email: "",
                    password: "",
                });
                localStorage.setItem('token', data.token)
                navigate('/shops')
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Error during signup:", error);
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Create Account</h1>


                <input
                    type="text"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <div className="error-message">{errors.email}</div>

                <input
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <div className="error-message">{errors.password}</div>
                <button className="my-3 pointer">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;
