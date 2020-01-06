import React, { Component } from 'react';

import './Deliveries.css';

export default class DeliveriesList extends Component {
    render() {
        return (
            <div className="page page--deliveries page--deliveries--list">
                <section className="section section--heading">
                    <h1 className="page-title">Deliveries</h1>
                    <p className="description">On this page you would list out all logistical packages and shipments.</p>
                </section>
            </div>
        )
    }
}
