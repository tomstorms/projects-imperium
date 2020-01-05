import React from 'react';
import { NavLink } from 'react-router-dom';

import './TileLink.css';

const TileLink = props => (
    <div className="tile tile-link">
        <div className="tile-header">
            {props.heading && <h2 className="tile-heading">{props.heading}</h2> }
            {props.description && <p className="tile-description">{props.description}</p> }
            {props.link && <NavLink to={props.link} className="btn">{props.linkText}</NavLink> }
        </div>
    </div>
);

export default TileLink;
