import React from 'react';
import { NavLink } from 'react-router-dom';

import './TileLink.css';

const TileLink = props => (
    <div className="tile tile-link">
        <div className={props.icon ? 'tile-header tile-header--icon' : 'tile-header'}>
            { props.icon && 
            <div className="icon-container">
                {props.link && <img src={props.icon} alt="" /> }
            </div>
            }
            <div className="text-container">
                {props.heading && <h2 className="tile-heading">{props.heading}</h2> }
                {props.description && <p className="tile-description">{props.description}</p> }
                {props.link && <NavLink to={props.link} className="btn">{props.linkText}</NavLink> }
            </div>
        </div>
    </div>
);

export default TileLink;
