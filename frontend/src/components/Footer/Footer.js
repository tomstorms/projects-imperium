import React from 'react';

import AuthContext from '../../context/auth-context';

import './Footer.css';

const Footer = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <React.Fragment>
                    <footer>
                        <div className="section section--footer">
                            &copy; 2020 - Imperium
                        </div>
                    </footer>
                </React.Fragment>
            )
        }}
    </AuthContext.Consumer>
);

export default Footer;
