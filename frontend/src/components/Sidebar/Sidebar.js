import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import LogoIcon from '../../images/logo-icon.png';
import LogoText from '../../images/logo-text.png';

import IconDashboard from './Icons/icon-dashboard.svg';
import IconEmail from './Icons/icon-email.svg';
import IconReservations from './Icons/icon-reservations.svg';
import IconDeliveries from './Icons/icon-deliveries.svg';
import IconTransfers from './Icons/icon-transfers.svg';
import IconCog from './Icons/icon-cog.svg';

import './Sidebar.css';

const Sidebar = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <nav class="main-menu">
                    <ul>
                        <li>
                            <div className="menu-item menu-item--logo">
                                <img src={LogoIcon} alt="" className="icon icon--sidebar icon--logo" />
                                <span class="nav-text">
                                    <img src={LogoText} alt="Imperium" className="logo logo--text" />
                                </span>
                            </div>
                        </li>
                        <li>
                            <div className="menu-item">
                                <NavLink to="/dashboard">
                                    <img src={IconDashboard} alt="" className="icon icon--sidebar" />
                                    <span class="nav-text">
                                        Dashboard
                                    </span>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="menu-item">
                                <NavLink to="/email">
                                    <img src={IconEmail} alt="" className="icon icon--sidebar" />
                                    <span class="nav-text">
                                        Email
                                    </span>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="menu-item has-children">
                                <NavLink to="/reservations">
                                    <img src={IconReservations} alt="" className="icon icon--sidebar" />
                                    <span class="nav-text">
                                        Reservations
                                    </span>
                                </NavLink>
                                <ul>
                                    <li>
                                        <div className="menu-item">
                                            <NavLink to="/reservations/new">
                                                <span class="nav-text">
                                                    New Reservation
                                                </span>
                                            </NavLink>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="menu-item">
                                <NavLink to="/deliveries">
                                    <img src={IconDeliveries} alt="" className="icon icon--sidebar" />
                                    <span class="nav-text">
                                        Deliveries
                                    </span>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="menu-item">
                                <NavLink to="/transfers">
                                    <img src={IconTransfers} alt="" className="icon icon--sidebar" />
                                    <span class="nav-text">
                                        Transfers
                                    </span>
                                </NavLink>
                            </div>
                        </li>
                    </ul>

                    <ul class="footer">
                        <li>
                            <div className="menu-item">
                                <NavLink to="/admin">
                                    <img src={IconCog} alt="" className="icon icon--sidebar" />
                                    <span class="nav-text">
                                        Settings
                                    </span>
                                </NavLink>
                            </div>
                        </li>
                    </ul>
                </nav>
            )
        }}
    </AuthContext.Consumer>
);

export default Sidebar;



