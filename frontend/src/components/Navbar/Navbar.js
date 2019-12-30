import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import Logo from '../../images/logo.png';
import './Navbar.css';

const Navbar = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <React.Fragment>
                    {!context.token && 
                        <header className="navbar">
                            <NavLink to="/"><img src={Logo} alt="Imperium" className="logo" /></NavLink>
                        </header>
                    }
                    {context.token && 
                        <header className="navbar">
                            <NavLink to="/"><img src={Logo} alt="Imperium" className="logo" /></NavLink>
                            <nav className="navbar__items">
                                <ul>
                                    {!context.token && 
                                    <li><NavLink to="/auth">Authenticate</NavLink></li>
                                    }
                                    <li><NavLink to="/events">Events</NavLink></li>
                                    {context.token && 
                                    <React.Fragment>
                                        <li><NavLink to="/bookings">Bookings</NavLink></li>
                                        <li><button onClick={context.logout}>Logout</button></li>
                                    </React.Fragment>
                                    }
                                </ul>
                            </nav>
                        </header>
                    }
                </React.Fragment>
            )
        }}
    </AuthContext.Consumer>
);

export default Navbar;
