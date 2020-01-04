import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Login.css';
import AuthContext from '../../context/auth-context';

import LoginHero from '../../images/login/hero.png';
export default class LoginRegister extends Component {
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
            alert('You must enter an email address and password');
            return;
        }

        let requestBody = {
            email: email,
            password: password,
        };

        fetch(`http://${process.env.REACT_APP_API_SERVER}/users/register`, {
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
            if (resData.status) {
                // Failed. Has Status value 
                if ((resData.status) !== 200 && resData.status !== 201) {
                    let errMessage = 'Failed!';
                    if (resData.message) {
                        errMessage = resData.message;
                    }
                    throw new Error(errMessage);
                }
            }
            else {
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
            }
        }).catch(err => {
            alert('Login failed');
            console.log(err);
        });
    };

    render() {
        return (
            <section className="page page--login page--login-register">
                <div class="pane--left">
                    <h1>Let's Get Started.</h1>
                    <p className="description">Complete this form and you're only a click away from setting up your establishment.</p>

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
                            <button type="submit" className="btn btn-primary btn-rounded">Register Now</button>
                        </div>

                        <p>Already have an account? <Link to="/login">Login now</Link>.</p>
                    </form>
                </div>
                <div class="pane--right">
                    <img src={LoginHero} alt="Imperium" className="logo" />
                </div>
            </section>
        );
    }
}
