import React, { Component } from 'react';

import PlaceholderTile from '../../components/Tiles/PlaceholderTile/PlaceholderTile';
import ReservationOverviewTile from '../../components/Tiles/ReservationTile/ReservationTile';

import './Dashboard.css';
import '../../components/Tiles/Tiles.css';

export default class Dashboard extends Component {
    render() {
        return (
            <div className="page page--dashboard">
                <section className="section section--heading">
                    <h1 className="page-title">Dashboard</h1>
                </section>
                <section className="section section--tiles">
                    <ReservationOverviewTile></ReservationOverviewTile>
                    <PlaceholderTile></PlaceholderTile>
                </section>
            </div>
        )
    }
}
