import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthContext from './context/auth-context';

import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import LoginRegisterPage from './pages/Login/LoginRegister';
import DashboardPage from './pages/Dashboard/Dashboard';
import ErrorPage from './pages/Error/Error';
import Navbar from './components/Navbar/Navbar';
// import BookingsPage from './pages/Bookings';
// import EventsPage from './pages/Events';

import './App.css';

class App extends Component {
  state = {
    token: sessionStorage.getItem('token'),
  }

  login = (token) => {
    sessionStorage.setItem('token', token);
    this.setState({token: token });
  }

  logout = () => {
    sessionStorage.removeItem('token');
    this.setState({token: null });
  }

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
          <Navbar></Navbar>
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect from="/" to="/dashboard" exact /> }
              {this.state.token && <Redirect from="/login" to="/dashboard" exact /> }
              {this.state.token && <Route path="/dashboard" component={DashboardPage} /> }

              {!this.state.token && <Route path="/" component={HomePage} exact /> }
              {!this.state.token && <Route path="/login" component={LoginPage} exact /> }
              {!this.state.token && <Route path="/register" component={LoginRegisterPage} exact /> }
              <Route path="*" component={ErrorPage}/>
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
