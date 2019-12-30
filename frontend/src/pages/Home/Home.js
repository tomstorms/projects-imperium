import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

export default class Home extends Component {
    render() {
        return (
            <section className="page--home">
                <div className="description">The All-in-one Resort Management Platform</div>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <p>or <Link to="/register">Create an Account</Link></p>
            </section>
        )
    }
}
