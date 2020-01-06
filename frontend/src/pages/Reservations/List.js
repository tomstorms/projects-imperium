import React, { Component } from 'react';

import './Reservations.css';

export default class ReservationsList extends Component {
    render() {
        return (
            <div className="page page--reservations page--reservations--list">
                <section className="section section--heading">
                    <h1 className="page-title">Reservations</h1>
                    <p className="description">On this page you would list out all reservations.</p>
                </section>
            </div>
        )
    }
}
