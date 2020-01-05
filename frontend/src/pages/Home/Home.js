import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';
import HomeHero from '../../images/home/hero.png';

export default class Home extends Component {
    render() {
        return (
            <div className="page page--home">
                <section className="hero">
                    <div className="pane--left">
                        <h1>Transparency for Hoteliers.</h1>
                        <p className="description">
                            The all-in-one, cloud-based communication platform that helps facilitate touch-points with guests from enquiry to check out.
                        </p>
                        <Link to="/login" className="btn btn-primary btn-rounded">Get Started</Link>
                    </div>
                    <div className="pane--right">
                        <img src={HomeHero} alt="Imperium" className="logo" />
                    </div>
                </section>
            </div>
        )
    }
}
