import React, { Component } from 'react';

import './Deliveries.css';

export default class DeliveriesNew extends Component {
    render() {
        return (
            <div className="page page--deliveries page--deliveries--new">
                <section className="section section--heading">
                    <h1 className="page-title">New Delivery</h1>
                    <p className="description">On this page you would create a new item to be delivered and tracked.</p>
                </section>
            </div>
        )
    }
}
