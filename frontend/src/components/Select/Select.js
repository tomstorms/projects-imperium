import React, { Component } from 'react'

import './Select.css';

// import IconArrowUp from './icon-arrow-down.png';
import IconArrowDown from './icon-arrow-down.png';

export default class Select extends Component {
    changeHandler = (event) => {
        const value = event.target.value;
        this.props.onChange(value);
    };

    render() {
        return (
            <React.Fragment>
                <div className="select-container">
                    <select style={{backgroundImage:'url('+IconArrowDown+')'}} onChange={this.changeHandler}>
                        { this.props.data && this.props.data.length > 0 && this.props.data.map(establishment => {
                            return (
                                <option key={establishment._id} value={establishment._id}>{establishment.name}</option>
                            )
                        })}
                    </select>
                </div>
            </React.Fragment>
        )
    }
}
