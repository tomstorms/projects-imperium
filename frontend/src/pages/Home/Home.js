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
                        <h1>Empowering Hoteliers!</h1>
                        <p className="description">
                            The all-in-one, cloud-based reservation and property management system. A full integrated and seamless solution for your hospitality business needs.</p>
                        <Link to="/login" className="btn btn-primary btn-rounded">Manage my establishment</Link>
                    </div>
                    <div className="pane--right">
                        <img src={HomeHero} alt="Imperium" className="logo" />
                    </div>
                </section>
            </div>
        )
    }
}
