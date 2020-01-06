import React, { Component } from 'react';

import './Transfers.css';

export default class TransfersList extends Component {
    render() {
        return (
            <div className="page page--transfers page--transfers--list">
                <section className="section section--heading">
                    <h1 className="page-title">Transfers</h1>
                    <p className="description">On this page you would list out all logistical guest transfers.</p>
                </section>
            </div>
        )
    }
}
