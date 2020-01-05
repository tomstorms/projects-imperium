import React from 'react';

import './TileList.css';

const TileList = props => (
    <section className={`section section--tiles${props.col ? ' section--tiles--' + props.col : ''}`}>
        {props.children}
    </section>
);

export default TileList;