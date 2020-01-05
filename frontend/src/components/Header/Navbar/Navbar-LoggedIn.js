import React from 'react';
import { NavLink } from 'react-router-dom';

import LogoIcon from '../../../images/logo-icon.png';
import LogoText from '../../../images/logo-text.png';
import './Navbar.css';

const NavbarLoggedIn = props => (
    <React.Fragment>
        <div className="left-menu">
            <div className="logo-container">
                <NavLink to="/">
                    <img src={LogoIcon} alt="" className="logo logo--icon" />
                    <img src={LogoText} alt="Imperium" className="logo logo--text" />
                </NavLink>
            </div>
            <div className="filter-container">
                <select>
                    <option>All Establishments</option>
                </select>
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
);

export default NavbarLoggedIn;
