import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthContext from './context/auth-context';

import Navbar from './components/Navbar/Navbar';
import NavbarLoggedIn from './components/Navbar/Navbar-LoggedIn';

import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import LoginRegisterPage from './pages/Login/LoginRegister';
import DashboardPage from './pages/Dashboard/Dashboard';
import LogoutPage from './pages/Login/Logout';
import ErrorPage from './pages/Error/Error';

import AdminPage from './pages/Admin/Admin';
import EstablishmentsPage from './pages/Admin/Establishments/Establishments';
import RoomCategoryPage from './pages/Admin/RoomCategory/RoomCategory';
import RoomsPage from './pages/Admin/Rooms/Rooms';

import './App.css';

class App extends Component {
    state = {
        token: localStorage.getItem('token'),
        tokenExpiration: null,
        userId: null,
        userRole: null,
        userProfile: null,
        estData: null,
        estId: sessionStorage.getItem('estId'),
    }
    
    login = (token, tokenExpiration, userId, userRole, userProfile) => {
        localStorage.setItem('token', token);
        this.setState({ 
            token: token,
            tokenExpiration: tokenExpiration,
            userId: userId,
            userRole: userRole,
            userProfile: userProfile,
        });
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
        this.loadEstablishmentData();
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
            // this.showErrorMessage(err.message);
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

                <main>
                <Switch>
                    {isLoggedIn && <Redirect from="/" to="/dashboard" exact /> }
                    {isLoggedIn && <Redirect from="/login" to="/dashboard" exact /> }
                    {isLoggedIn && <Route path="/dashboard" component={DashboardPage} exact /> }
                    {isLoggedIn && <Route path="/logout" component={LogoutPage} exact /> }
                    
                    {isLoggedIn && <Route path="/admin" component={AdminPage} exact /> }
                    {isLoggedIn && <Route path="/admin/establishments" component={EstablishmentsPage} exact /> }
                    {isLoggedIn && <Route path="/admin/rooms" component={RoomsPage} exact /> }
                    {isLoggedIn && <Route path="/admin/room-category" component={RoomCategoryPage} exact /> }
                    
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
