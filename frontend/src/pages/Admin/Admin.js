import React, { Component } from 'react';

import TileList from '../../components/TileList/TileList';
import TileLink from '../../components/Tiles/TileLink/TileLink';

import './Admin.css';
import '../../components/Tiles/Tiles.css';

export default class Admin extends Component {
    render() {
        return (
            <div className="page page--admin">
                <section className="section section--heading">
                    <h1 className="page-title">Admin</h1>
                </section>
                <TileList col="3">
                    <TileLink heading="Establishments" description="Manage or create new establishments" link="/admin/establishments" linkText="Manage Establishments"></TileLink>
                    <TileLink heading="Room Categories" description="Manage or create new establishment room categories" link="/admin/room-category" linkText="Manage Room Categories"></TileLink>
                    <TileLink heading="Room" description="Manage or create a new room" link="/admin/rooms" linkText="Manage Rooms"></TileLink>
                </TileList>
            </div>
        )
    }
}