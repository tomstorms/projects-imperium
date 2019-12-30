import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Login.css';
import AuthContext from '../../context/auth-context';

export default class Login extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submitHandler = (event) => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            identifier: email,
            password: password,
        };

        fetch(`http://${process.env.REACT_APP_API_SERVER}/auth/local`, {
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
            alert(err);
        });
    };

    render() {
        return (
            <section className="page--login page--login-home">
                <h1>Login</h1>
                <form className="form--login" onSubmit={this.submitHandler}>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={this.emailEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordEl}></input>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>

                    <p>Don't have an account? <Link to="/register">Create an Account</Link></p>
                </form>
            </section>
        );
    }
}
