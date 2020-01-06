import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Select from '../../components/Select/Select';
import Icon from '../../components/Icon/Icon';

import './Navbar.css';

export default class NavbarLoggedIn extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="left-menu">
                    <div className="filter-container">
                        <Select data={this.props.estData} onChange={this.props.onEstablishmentChange}></Select>
                    </div>
                </div>
                <div className="right-menu">
                    <nav className="navbar__items">
                        <ul>
                            <li><NavLink to="/logout">Logout</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </React.Fragment>
        )
    }
}
