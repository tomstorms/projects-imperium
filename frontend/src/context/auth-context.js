import React from 'react';

export default React.createContext({
    token: null,
    userRole: null,
    userProfile: null,
    login: (token) => {},
    logout: () => {},
});