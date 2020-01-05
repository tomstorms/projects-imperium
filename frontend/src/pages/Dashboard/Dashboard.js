import React, { Component } from 'react';

import ReservationOverviewTile from '../../components/Tiles/ReservationOverviewTile/ReservationOverviewTile'
import TileBlock from '../../components/Tiles/TileBlock/TileBlock';

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
                    <TileBlock heading="Tile 2" description="This is a description for etile 2">
                        <p>Hello World from Tile 2</p>
                    </TileBlock>
                    <TileBlock heading="Tile 3" description="This is a description for etile 3">
                        <p>Hello World from Tile 3</p>
                    </TileBlock>
                </section>
            </div>
        )
    }
}
