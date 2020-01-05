import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../../components/Alert/Alert';

import './Login.css';
import AuthContext from '../../context/auth-context';

import LoginHero from '../../images/login/hero.png';
export default class LoginRegister extends Component {
    state = {
        hasError: false,
        errMessage: null,
        errType: null
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    showErrorMessage = (err, errType='danger') => {
        console.log('showErrorMessage');
        console.log(err);
        this.setState({hasError: true, errMessage: err, errType: errType});
    }

    hideErrorMessage = (errMessage) => {
        this.setState({hasError: false, errMessage: null});
    }

    submitHandler = (event) => {
        event.preventDefault();

        this.hideErrorMessage();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            this.showErrorMessage('You must enter an email address and password');
            return;
        }

        this.doUserRegister(email, password);
        console.log('exit submitHandler');
    };

    doUserRegister = (email, password) => {
        const requestBody = {
            query: `
                mutation CreateUser($email: String!, $password: String!) {
                    createUser(userInput: {email: $email, password: $password}) {
                        _id
                        email
                    }
                }
            `,
            variables: {
                email: email,
                password: password,
            }
        };

        fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
            if (resData.errors) {
                throw new Error(resData.errors[0].message);
            }
            if (resData.data.createUser) {
                this.showErrorMessage('Your account has been created. Logging you in...', 'success');

                this.doUserLogin(email, password);
                console.log('exit doUserRegister');

            }
            else {
                throw new Error('Failed to create account');
            }
        }).catch(err => {
            this.showErrorMessage(err.message);
            return;
        });
    }

    doUserLogin = (email, password) => {
        const requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                        userRole
                    }
                }
            `,
            variables: {
                email: email,
                password: password,
            }
        };

        fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
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
            if (resData.errors) {
                throw new Error(resData.errors[0].message);
            }

            if (resData.data.login.token) {
                console.log('exit doUserLogin');

                this.context.login(
                    resData.data.login.token,
                    resData.data.login.tokenExpiration,
                    resData.data.login.userId,
                    resData.data.login.userRole,
                    resData.data.login.userProfile,
                );

                window.location.href = '/dashboard';
            }
            else {
                throw new Error('Failed to get token');
            }
        }).catch(err => {
            this.showErrorMessage(err.message);
            return;
        });
    }

    render() {
        return (
            <div className="page page--login page--login-register">
                <section className="form">
                    <div className="pane--left">
                        <h1>Let's Get Started.</h1>
                        <p className="description">Complete this form and you're only a click away from setting up your establishment.</p>

                        {this.state.hasError &&
                            <Alert message={this.state.errMessage} type={this.state.errType}></Alert>
                        }

                        <form className="form--login" onSubmit={this.submitHandler}>
                            <div className="form-control">
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" ref={this.emailEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" ref={this.passwordEl}></input>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Register Now</button>
                            </div>

                            <p>Already have an account? <Link to="/login">Login now</Link>.</p>
                        </form>
                    </div>
                    <div className="pane--right">
                        <img src={LoginHero} alt="Imperium" className="logo" />
                    </div>
                </section>
            </div>
        );
    }
}
