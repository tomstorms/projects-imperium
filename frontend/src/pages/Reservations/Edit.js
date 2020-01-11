import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';
import Alert from '../../components/Alert/Alert';

import TileList from '../../components/TileList/TileList';
import TileBlock from '../../components/Tiles/TileBlock/TileBlock';

import './Reservations.css';

export default class ReservationsEdit extends Component {
    state = {
        isLoading: false,
        reservationData: null,
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.getReservation(this.props.match.params.id);
    };

    getReservation = (bookingRef) => {
        const requestBody = {
            query: `
                mutation GetReservation($bookingRef: String!) {
                    getReservationByBookingRef(reservationInput:{booking_ref: $bookingRef}) {
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
            variables: {
                bookingRef: bookingRef,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            console.log(resData);
            if (resData.getReservationByBookingRef) {
                this.setState({reservationData: resData.getReservationByBookingRef, isLoading: false});
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

    render() {
        let tileHeading = "Loading Reservation...";
        if (this.state.reservationData && this.state.reservationData.booking_ref) {
            tileHeading = "Booking: " + this.state.reservationData.booking_ref;
        }

        let content = <Spinner />;
        if (this.state.reservationData && !this.state.isLoading) {
            content = (
                <React.Fragment>
                    <TileList col="1">
                        <TileBlock heading="Primary Contact" tileClass="tile-reservation--edit">
                            <div className="contact">
                                <div className="name">
                                    { this.state.reservationData.primary_contact.first_name } { this.state.reservationData.primary_contact.last_name}
                                </div>
                                <div className="email">
                                    { this.state.reservationData.primary_contact.email}
                                </div>
                            </div>
                        </TileBlock>
                    </TileList>
                </React.Fragment>
            );

            if (this.context.userRole !== 'superadmin') {
                content = (
                    <section className="section section--error">
                        <Alert message="You must be a superadmin to access this page." ></Alert>
                    </section>
                )
            }
        }

        return (
            <React.Fragment>
                <div className="page page--reservations page--reservations--list">
                    <section className="section section--heading">
                        <h1 className="page-title">{tileHeading}</h1>
                    </section>
                    {content}
                    <section className="section section--footer">
                        <NavLink to="/reservations">Back to Reservations</NavLink>    
                    </section>
                </div>
            </React.Fragment>
        );
    };
}
