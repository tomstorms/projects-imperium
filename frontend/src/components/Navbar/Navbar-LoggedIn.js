import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Select from '../../components/Select/Select';
import Icon from '../../components/Icon/Icon';

import LogoIcon from '../../images/logo-icon.png';
import LogoText from '../../images/logo-text.png';
import './Navbar.css';

export default class NavbarLoggedIn extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="left-menu">
                    <div className="logo-container">
                        <NavLink to="/">
                            <img src={LogoIcon} alt="" className="logo logo--icon" />
                            <img src={LogoText} alt="Imperium" className="logo logo--text" />
                        </NavLink>
                    </div>
                    <div className="filter-container">
                        <Select data={this.props.estData} onChange={this.props.onEstablishmentChange}></Select>
                        <Icon type="cog" link="/admin"></Icon>
                    </div>
                </div>
                <div className="right-menu">
                    <nav className="navbar__items">
                        <ul>
                            <li><NavLink to="/rooms">Rooms</NavLink></li>
                            <li><NavLink to="/room-category">Room Categories</NavLink></li>
                            <li><NavLink to="/logout">Logout</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </React.Fragment>
        )
    }
}
