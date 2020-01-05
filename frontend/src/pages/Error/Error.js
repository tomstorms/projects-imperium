import React, { Component } from 'react'

export default class Error extends Component {
    render() {
        return (
            <div className="page page--404">
                <section className="section section--heading">
                    <h1 className="page-title">Sorry...</h1>
                    <p>The page you are searching for doesn't exist.</p>
                </section>
            </div>
        )
    }
}
