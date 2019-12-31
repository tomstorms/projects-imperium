import React from 'react';

export default React.createContext({
    token: null,
    userRole: null,
    login: (token) => {},
    logout: () => {},
});