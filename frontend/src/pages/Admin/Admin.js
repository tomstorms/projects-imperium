import React, { Component } from 'react';

import AuthContext from '../../context/auth-context';

import Alert from '../../components/Alert/Alert';
import TileList from '../../components/TileList/TileList';
import TileLink from '../../components/Tiles/TileLink/TileLink';

import './Admin.css';
import '../../components/Tiles/Tiles.css';

import IconHotel from '../../images/icons/icon-hotel.svg';
import IconBed from '../../images/icons/icon-bed.svg';

export default class Admin extends Component {
    static contextType = AuthContext;

    render() {
        return (
            <div className="page page--admin">
                <section className="section section--heading">
                    <h1 className="page-title">Admin</h1>
                </section>

                { this.context.userRole !== 'superadmin' && (
                    <section className="section section--error">
                        <Alert message="You must be a superadmin to access this page." ></Alert>
                    </section>
                )}

                { this.context.userRole === 'superadmin' &&
                <React.Fragment>
                    <TileList col="3">
                        <TileLink heading="Establishments" description="Manage or create new establishments" link="/admin/establishments" linkText="Manage Establishments" icon={IconHotel}></TileLink>
                    </TileList>
                    <section className="section section--heading">
                        <h1 className="page-title">Reservations</h1>
                    </section>
                    <TileList col="3">
                        <TileLink heading="Room Categories" description="Manage or create new establishment room categories" link="/admin/room-category" linkText="Manage Room Categories" icon={IconBed}></TileLink>
                        <TileLink heading="Rooms" description="Manage or create a new room" link="/admin/rooms" linkText="Manage Rooms" icon={IconBed}></TileLink>
                    </TileList>
                </React.Fragment>
                }

            </div>
        )
    }
}
