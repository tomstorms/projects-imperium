import React from 'react';

import './TileBlock.css';

const TileBlock = props => (
    <div className={`tile tile-block${props.tileClass ? ' '+props.tileClass : ''}`}>
        {(props.heading !=='' || props.description !== '') && (
            <div className="tile-header">
                {props.heading && <h2 className="tile-heading">{props.heading}</h2> }
                {props.description && <p className="tile-description">{props.description}</p> }
            </div>
        )}
        {props.children && (
            <div className="tile-body">
                {props.children}
            </div>
        )}
    </div>
);

export default TileBlock;
