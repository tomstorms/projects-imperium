import React from 'react';

export default React.createContext({
    token: null,
    userRole: null,
    login: (token, tokenExpiration, userId, userRole) => {},
    logout: () => {},
});