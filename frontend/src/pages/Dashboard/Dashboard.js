import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Dashboard.css';

export default class Dashboard extends Component {
    render() {
        return (
            <section className="page--dashboard">
                Welcome to your Dashboard
                <Link to="/logout">Logout</Link>
            </section>
        )
    }
}
