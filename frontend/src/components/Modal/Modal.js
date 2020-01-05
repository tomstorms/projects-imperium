import React from 'react';

import './Modal.css';

const modal = props => (
    <React.Fragment>
        <div className="modal">
            <div className="modal__header">
                <div className="modal__tite">{props.title}</div>
            </div>
            <div className="modal__content">
                {props.children}
            </div>
            <div className="modal__actions">
                {props.canCancel && (
                    <button className="btn btn--cancel" onClick={props.onCancel}>Cancel</button>
                )}
                {props.canConfirm && (
                    <button className="btn btn--confirm" onClick={props.onConfirm}>{props.confirmText}</button> 
                )}
            </div>
        </div>
        <div className="modal__backdrop"></div>
    </React.Fragment>
);

export default modal;