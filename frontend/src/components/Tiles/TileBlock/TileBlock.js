import React from 'react';

import './TileBlock.css';

const TileBlock = props => (
    <div className="tile tile-block">
        <div className="tile-body">
            {props.heading && <h2 className="tile-heading">{props.heading}</h2> }
            {props.description && <p className="tile-description">{props.description}</p> }
            {props.children}
        </div>
    </div>
);

export default TileBlock;
