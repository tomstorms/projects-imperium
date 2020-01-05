import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import IconCog from './Icons/icon-cog.png';

import './Icon.css';

export default class Icon extends Component {
    render() {

        let icon;
        if (this.props.type === 'cog') icon = IconCog;

        return (
            <React.Fragment>
            {this.props.link && ( 
                <NavLink to={this.props.link}>
                    <img src={icon} alt="" className={`icon icon--${this.props.type}`} />
                </NavLink> 
            )}
            {!this.props.link && ( 
                <img src={icon} alt="" className={`icon icon--${this.props.type}`} />
            )}

            </React.Fragment>
        )
    }
}
