import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import Logo from '../../images/logo.png';
import './Header.css';
import './Navbar.css';

const Header = props => (
    <AuthContext.Consumer>
        {(context) => {
            const isLoggedIn = (context.token);

            return (
                <React.Fragment>
                    {!isLoggedIn && 
                        <header>
                            <div className="section section--navbar">
                                <NavLink to="/"><img src={Logo} alt="Imperium" className="logo" /></NavLink>
                                <nav className="navbar__items">
                                    <ul>
                                        <li><NavLink to="/register">Sign up</NavLink></li>
                                        <li><NavLink to="/login" className="btn btn-primary btn-rounded">Login</NavLink></li>
                                    </ul>
                                </nav>
                            </div>
                        </header>
                    }
                    {isLoggedIn && 
                        <header className="loggedin">
                            <div className="section section--navbar">
                                <NavLink to="/"><img src={Logo} alt="Imperium" className="logo" /></NavLink>
                                <nav className="navbar__items">
                                    <ul>
                                        <li><NavLink to="/rooms">Rooms</NavLink></li>
                                        <li><NavLink to="/room-category">Room Categories</NavLink></li>
                                        <li><NavLink to="/logout">Logout</NavLink></li>
                                    </ul>
                                </nav>
                            </div>
                        </header>
                    }
                </React.Fragment>
            )
        }}
    </AuthContext.Consumer>
);

export default Header;
