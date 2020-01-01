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
            email: email,
            password: password,
        };

        fetch(`http://${process.env.REACT_APP_API_SERVER}/users/login`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            // Successful response
            if (resData.token) {
                this.context.login(resData.token, resData.user_role);
                window.location.href = '/dashboard';
            }
            else {
                let errMessage = 'Failed!';
                if (resData.message) {
                    errMessage = resData.message;
                }
                throw new Error(errMessage);
            }
        }).catch(err => {
            alert(err);
        });
    };

    render() {
        return (
            <section className="page page--login page--login-home">
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
