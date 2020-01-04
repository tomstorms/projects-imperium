import React from 'react';

import './Alert.css';

const alert = props => (
    <React.Fragment>
        <div className={`alert alert--${props.type}`}>
            <div className="message">{props.message}</div>
        </div>
    </React.Fragment>
);

export default alert;