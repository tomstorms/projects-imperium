import React, { Component } from 'react';

import './Reservations.css';

export default class ReservationsNew extends Component {
    render() {
        return (
            <div className="page page--reservations page--reservations--new">
                <section className="section section--heading">
                    <h1 className="page-title">New Reservation</h1>
                    <p className="description">On this page you would create a new reservation.</p>
                </section>
            </div>
        )
    }
}