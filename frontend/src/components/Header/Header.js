import React from 'react';

import Navbar from './Navbar/Navbar';
import NavbarLoggedIn from './Navbar/Navbar-LoggedIn';

import AuthContext from '../../context/auth-context';

import './Header.css';

const Header = props => (
    <AuthContext.Consumer>
        {(context) => {
            const isLoggedIn = (context.token);

            return (
                <React.Fragment>
                    <header>
                        <div className="section section--navbar">
                            {!isLoggedIn && <Navbar></Navbar> }
                            {isLoggedIn && <NavbarLoggedIn></NavbarLoggedIn> }
                        </div>
                    </header>
                </React.Fragment>
            )
        }}
    </AuthContext.Consumer>
);

export default Header;
