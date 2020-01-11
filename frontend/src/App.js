import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import jwt from 'jsonwebtoken';

import AuthContext from './context/auth-context';

import Navbar from './components/Navbar/Navbar';
import NavbarLoggedIn from './components/Navbar/Navbar-LoggedIn';
import Sidebar from './components/Sidebar/Sidebar';

import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import LoginRegisterPage from './pages/Login/LoginRegister';
import DashboardPage from './pages/Dashboard/Dashboard';
import LogoutPage from './pages/Login/Logout';
import ErrorPage from './pages/Error/Error';

import AdminPage from './pages/Admin/Admin';
import AdminEstablishmentsPage from './pages/Admin/Establishments/Establishments';
import AdminRoomCategoryPage from './pages/Admin/RoomCategory/RoomCategory';
import AdminRoomsPage from './pages/Admin/Rooms/Rooms';

import ReservationsPage from './pages/Reservations/List';
import ReservationsEditPage from './pages/Reservations/Edit';

import TransfersPage from './pages/Transfers/List';
import TransfersNewPage from './pages/Transfers/New';
import TransfersEditPage from './pages/Transfers/Edit';

import DeliveriesPage from './pages/Deliveries/List';
import DeliveriesNewPage from './pages/Deliveries/New';
import DeliveriesEditPage from './pages/Deliveries/Edit';

import ContactsPage from './pages/Contacts/Contacts';

import EmailPage from './pages/Email/Inbox';

import './App.css';

class App extends Component {
    state = {
        token: localStorage.getItem('token'),
        tokenExpiration: null,
        userId: null,
        userRole: null,
        userProfile: null,
        estData: null,
        estId: null,
    }
    
    login = (token) => {
        localStorage.setItem('token', token);
        this.setState({
            token: token,
        });

        this.authUser();
    }
    
    logout = () => {
        localStorage.removeItem('token');
        this.setState({
            token: null,
            tokenExpiration: null,
            userId: null,
            userRole: null,
            userProfile: null,
            estData: null,
            estId: null,
        });
    }

    componentDidMount = () => {
        this.authUser();
        this.sessionValid();

        const isLoggedIn = (this.state.token);
        if (isLoggedIn) {
            this.loadEstablishmentData();
        }
    }

    sessionValid = () => {

        // Check if token provided
        const hasToken = (this.state.token);
        if (!hasToken) { 
            this.logout();
            return false;
        }

        // Check if token expired
        if (Date.now() >= (parseInt(this.state.tokenExpiration) * 1000)) {
            this.logout();
            return false;
        }

        // Check if online and has token
        if (!navigator.onLine) {
            // Is offline
            this.logout();
            return false;
        }

        return true;

    }

    authUser = () => {

        const token = this.state.token;
        let decodedToken; 
        try {
            decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
        } catch (err) {
            if (err.message) {
                console.log(err.message);
            }
            this.logout();
            return false;
        }
    
        if (!decodedToken) {
            console.log('Invalid decoded token');
            this.logout();
            return false;
        }

        this.setState({ 
            userId: decodedToken.userId,
            userRole: decodedToken.userRole,
            tokenExpiration: decodedToken.exp,
            userProfile: null, // a future thing
        });

        return true;
    }


    loadEstablishmentData = () => {
        const requestBody = {
            query: `
                query {
                    establishments {
                        _id
                        name
                    }
                }
            `
        };

        fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            if (resData.errors) {
                throw new Error(resData.errors[0].message);
            }

            if (resData.data.establishments) {
                this.setState({estData: resData.data.establishments});
            }
            else {
                throw new Error('Unable to load establishments');
            }
        }).catch(err => {
            console.log(err.message);
            return;
        });
    }

    onEstablishmentChangeHandler = (estId) => {
        sessionStorage.setItem('estId', estId);
        this.onEstablishmentChange();
    }

    onEstablishmentChange = () => {
        console.log('onEstablishmentChange called: ' + this.state.estId);
    }
    
    render() {
        const isLoggedIn = (this.state.token);

        return (
            <BrowserRouter>
            <AuthContext.Provider value={{
                token: this.state.token,
                userRole: this.state.userRole,
                login: this.login,
                logout: this.logout
            }}>
            <div className={`page-wrapper ${isLoggedIn ? 'loggedin' : ''}`}>
                <header>
                    <section className="section section--navbar">
                        {!isLoggedIn && <Navbar></Navbar> }
                        {isLoggedIn && <NavbarLoggedIn userRole={this.state.userRole} estData={this.state.estData} onEstablishmentChange={this.onEstablishmentChangeHandler}></NavbarLoggedIn> }
                    </section>
                </header>

                {isLoggedIn && (
                    <aside>
                        <Sidebar></Sidebar>
                    </aside>
                )}

                <main>
                <Switch>
                    {isLoggedIn && <Redirect from="/" to="/dashboard" exact /> }
                    {isLoggedIn && <Redirect from="/login" to="/dashboard" exact /> }
                    {isLoggedIn && <Route path="/dashboard" component={DashboardPage} exact /> }
                    {isLoggedIn && <Route path="/logout" component={LogoutPage} exact /> }
                    
                    {isLoggedIn && <Route path="/admin" component={AdminPage} exact /> }
                    {isLoggedIn && <Route path="/admin/establishments" component={AdminEstablishmentsPage} exact /> }
                    {isLoggedIn && <Route path="/admin/rooms" component={AdminRoomsPage} exact /> }
                    {isLoggedIn && <Route path="/admin/room-category" component={AdminRoomCategoryPage} exact /> }

                    {isLoggedIn && <Route path="/reservations" component={ReservationsPage} exact /> }
                    {isLoggedIn && <Route path="/reservations/edit/:id" component={ReservationsEditPage} exact /> }

                    {isLoggedIn && <Route path="/transfers" component={TransfersPage} exact /> }
                    {isLoggedIn && <Route path="/transfers/new" component={TransfersNewPage} exact /> }
                    {isLoggedIn && <Route path="/transfers/edit/:id" component={TransfersEditPage} exact /> }

                    {isLoggedIn && <Route path="/deliveries" component={DeliveriesPage} exact /> }
                    {isLoggedIn && <Route path="/deliveries/new" component={DeliveriesNewPage} exact /> }
                    {isLoggedIn && <Route path="/deliveries/edit/:id" component={DeliveriesEditPage} exact /> }

                    {isLoggedIn && <Route path="/contacts" component={ContactsPage} exact /> }

                    {isLoggedIn && <Route path="/email" component={EmailPage} exact /> }
                    
                    {!isLoggedIn && <Redirect from="/dashboard" to="/login" exact /> }
                    {!isLoggedIn && <Redirect from="/rooms" to="/login" exact /> }
                    {!isLoggedIn && <Route path="/" component={HomePage} exact /> }
                    {!isLoggedIn && <Route path="/login" component={LoginPage} exact /> }
                    {!isLoggedIn && <Route path="/register" component={LoginRegisterPage} exact /> }
                    
                    <Route path="/404" component={ErrorPage}/>
                    <Route component={ErrorPage}/>
                </Switch>
                </main>
                
                <footer>
                    <section className="section section--footer">
                        &copy; 2020 - Imperium
                    </section>
                </footer>
            </div>
            </AuthContext.Provider>
            </BrowserRouter>
        );
    }
}

export default App;
