import { Component } from 'react'

import AuthContext from '../../context/auth-context';

export default class Logout extends Component {
    static contextType = AuthContext;
    render() {
        this.context.logout();
        window.location.href = '/';
        return;
    }
}
