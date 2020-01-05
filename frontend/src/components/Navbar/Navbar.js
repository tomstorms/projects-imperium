import React from 'react';
import { NavLink } from 'react-router-dom';

import LogoIcon from '../../images/logo-icon.png';
import LogoText from '../../images/logo-text.png';
import './Navbar.css';

const Navbar = props => (
    <React.Fragment>
        <div className="left-menu">
            <div className="logo-container">
                <NavLink to="/">
                    <img src={LogoIcon} alt="" className="logo logo--icon" />
                    <img src={LogoText} alt="Imperium" className="logo logo--text" />
                </NavLink>
            </div>
        </div>
        <div className="right-menu">
            <nav className="navbar__items">
                <ul>
                <li><NavLink to="/register">Sign up</NavLink></li>
                <li><NavLink to="/login" className="btn btn-primary btn-rounded">Login</NavLink></li>
                </ul>
            </nav>
        </div>
    </React.Fragment>
);

export default Navbar;
