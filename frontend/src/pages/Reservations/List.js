import React, { Component } from 'react';

import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';

import ReservationTable from '../../components/Table/ReservationTable';
import TileList from '../../components/TileList/TileList';
import TileBlock from '../../components/Tiles/TileBlock/TileBlock';

import './Reservations.css';

export default class ReservationsList extends Component {
    state = {
        isLoading: false,
        reservationData: [],
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.getReservations();
    };

    getReservations = () => {
        const requestBody = {
            query: `
                query {
                    reservations {
                        _id
                        booking_ref
                        primary_contact {
                            _id
                            first_name
                            last_name
                            email
                        }
                    }
                }
            `,
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.reservations) {
                this.setState({reservationData: resData.reservations});
            }
        });
    }

    deleteReservation = (reservationId) => {
        const requestBody = {
            query: `
                mutation DeleteReservation($id: ID!) {
                    deleteReservation(reservationInput:{_id: $id})
                }
            `,
            variables: {
                id: reservationId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.deleteReservation) {
                this.setState(prevState => {
                    const reservationData = prevState.reservationData.filter(contactItem => {
                        return contactItem._id !== reservationId;
                    });
                    return { reservationData: reservationData };
                });
            }
        });
    }

    fetchData = (requestBody, callback) => {
        this.setState({isLoading: true});

        fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            if (resData.errors) {
                throw new Error(resData.errors[0].message);
            }

            if (resData.data) {
                this.setState({isLoading: false});
                callback(resData.data);
            }
            else {
                throw new Error('Unable to load data');
            }
            
        }).catch(err => {
            this.setState({isLoading: false});
            return;
        });
    };

    createHandler = () => {
        window.location.href = "/reservations/new";
    }

    editHandler = bookingRef => {
        window.location.href = "/reservations/edit/" + bookingRef;
    }

    deleteHandler = reservationId => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            this.deleteReservation(reservationId);
        }
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <TileList col="1">
                        <TileBlock heading="All Reservations" tileClass="tile-rooms">
                            <button className="btn btn-primary btn--new" onClick={this.createHandler}>Create New</button>
                            <ReservationTable 
                                data={this.state.reservationData}
                                onDelete={this.deleteHandler}
                                onEdit={this.editHandler}
                                onCreate={this.createHandler}
                            />
                        </TileBlock>
                    </TileList>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <div className="page page--reservations page--reservations--list">
                    <section className="section section--heading">
                        <h1 className="page-title">Reservations</h1>
                    </section>
                    {content}
                </div>
            </React.Fragment>
        );
    };
}

