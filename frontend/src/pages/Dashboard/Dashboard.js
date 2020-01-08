import React, { Component } from 'react';

import TileList from '../../components/TileList/TileList';
import TileBlock from '../../components/Tiles/TileBlock/TileBlock';
import ReservationOverviewTile from '../../components/Tiles/ReservationOverviewTile/ReservationOverviewTile'

import './Dashboard.css';
import '../../components/Tiles/Tiles.css';

import DashboardPlaceholder from '../../images/Placeholder/Dashboard.png';
export default class Dashboard extends Component {
    render() {
        return (
            <div className="page page--dashboard">
                <section className="section section--heading">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="description">These blocks are React components that could serve as it's own 'widget'.</p>
                </section>
                <TileList>
                    <ReservationOverviewTile></ReservationOverviewTile>
                    <TileBlock heading="Tile 2" description="This is a description for etile 2">
                        <p>Hello World from Tile 2</p>
                    </TileBlock>
                    <TileBlock heading="Tile 3" description="This is a description for etile 3">
                        <p>Hello World from Tile 3</p>
                    </TileBlock>
                </TileList>
                <section className="section section--heading">
                    <h1 className="page-title">Dashboard Prototype</h1>
                    <p className="description">Below is a placeholder screenshot demonstrating potential functionality for this page.</p>
                </section>
                <section className="section">
                    <img src={DashboardPlaceholder} alt=""/>
                </section>
            </div>
        )
    }
}
