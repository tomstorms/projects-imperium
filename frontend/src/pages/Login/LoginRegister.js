import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Login.css';
import AuthContext from '../../context/auth-context';

export default class LoginRegister extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.usernameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submitHandler = (event) => {
        event.preventDefault();

        const username = this.usernameEl.current.value;
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
            alert('You must enter a username, email address and password');
            return;
        }

        let requestBody = {
            username: username,
            email: email,
            password: password,
        };

        fetch(`http://${process.env.REACT_APP_API_SERVER}/auth/local/register`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
        .then(resData => {
            if (resData.status) {
                // Failed. Has Status value 
                if ((resData.status) !== 200 && resData.status !== 201) {
                    let errMessage = 'Failed!';
                    if (resData.message[0].messages[0].message) {
                        errMessage = resData.message[0].messages[0].message;
                    }
                    throw new Error(errMessage);
                }
            }
            else {
                // Successful response
                if (resData.jwt) {
                    this.context.login(resData.jwt);
                    window.location.href = '/dashboard';
                }
                else {
                    let errMessage = 'Failed!';
                    if (resData.message[0].messages[0].message) {
                        errMessage = resData.message[0].messages[0].message;
                    }
                    throw new Error(errMessage);
                }
            }
        }).catch(err => {
            alert('Login failed');
            console.log(err);
        });
    };

    render() {
        return (
            <section className="page--login page--login-register">
                <h1>Create an Account</h1>
                <form className="form--login" onSubmit={this.submitHandler}>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input type="username" id="username" ref={this.usernameEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={this.emailEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordEl}></input>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>

                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </section>
        );
    }
}
