import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import Logo from '../../images/logo.png';
import './Sidebar.css';

const Sidebar = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <React.Fragment>
                    {!context.token && 
                        <header className="sidebar">
                            <NavLink to="/"><img src={Logo} alt="Imperium" className="logo" /></NavLink>
                        </header>
                    }
                    {context.token && 
                        <header className="sidebar">
                            <NavLink to="/"><img src={Logo} alt="Imperium" className="logo" /></NavLink>
                            <nav className="sidebar__items">
                                <ul>
                                    <li><NavLink to="/rooms">Rooms</NavLink></li>
                                    <li><NavLink to="/room-category">Room Categories</NavLink></li>
                                    <li><NavLink to="/logout">Logout</NavLink></li>
                                </ul>
                            </nav>
                        </header>
                    }
                </React.Fragment>
            )
        }}
    </AuthContext.Consumer>
);

export default Sidebar;
