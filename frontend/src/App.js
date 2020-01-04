import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthContext from './context/auth-context';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import LoginRegisterPage from './pages/Login/LoginRegister';
import DashboardPage from './pages/Dashboard/Dashboard';
import LogoutPage from './pages/Login/Logout';
import ErrorPage from './pages/Error/Error';
import RoomsPage from './pages/Rooms/Rooms';
import RoomCategoryPage from './pages/RoomCategory/RoomCategory';
// import BookingsPage from './pages/Bookings';
// import EventsPage from './pages/Events';

import './App.css';

class App extends Component {
  state = {
    token: localStorage.getItem('token'),
    userRole: localStorage.getItem('token'),
  }

  login = (token, userRole) => {
    localStorage.setItem('token', token);
    this.setState({ token: token, userRole: userRole });
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ token: null, userRole: null });
  }

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
            token: this.state.token,
            login: this.login,
            logout: this.logout
          }}>
          <Header></Header>
          <main className="page-wrapper">
            <Switch>
              {this.state.token && <Redirect from="/" to="/dashboard" exact /> }
              {this.state.token && <Redirect from="/login" to="/dashboard" exact /> }
              {this.state.token && <Route path="/dashboard" component={DashboardPage} exact /> }
              {this.state.token && <Route path="/logout" component={LogoutPage} exact /> }
              {this.state.token && <Route path="/rooms" component={RoomsPage} exact /> }
              {this.state.token && <Route path="/room-category" component={RoomCategoryPage} exact /> }

              {!this.state.token && <Redirect from="/dashboard" to="/login" exact /> }
              {!this.state.token && <Redirect from="/rooms" to="/login" exact /> }
              {!this.state.token && <Route path="/" component={HomePage} exact /> }
              {!this.state.token && <Route path="/login" component={LoginPage} exact /> }
              {!this.state.token && <Route path="/register" component={LoginRegisterPage} exact /> }

              <Route path="/404" component={ErrorPage}/>
            </Switch>
          </main>
          <Footer></Footer>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
