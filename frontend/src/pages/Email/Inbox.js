import React, { Component } from 'react';

import './Email.css';

import InboxPlaceholder from '../../images/Placeholder/Inbox.png';

export default class EmailInbox extends Component {
    render() {
        return (
            <div className="page page--email">
                <section className="section section--heading">
                    <h1 className="page-title">Inbox</h1>
                    <p className="description">Below is a placeholder screenshot demonstrating potential functionality for this page.</p>
                    <p className="description">Emails could be piped and interacted on this platform.</p>
                </section>
                <section className="section">
                    <img src={InboxPlaceholder} alt="" />
                </section>
            </div>
        )
    }
}
