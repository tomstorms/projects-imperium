import React from 'react';

import './RoomCategoryList.css';

const RoomCategoryList = props => (
    <ul className="roomCategoryList">
        {props.data.map(roomCategory => {
            return (
                <li key={roomCategory._id} className="roomCategoryList--item">
                    <div className="roomCategoryList--data">
                        <div className="roomCategoryList--data-name">{roomCategory.name}</div>
                        <div className="roomCategoryList--data-price">PHP {roomCategory.price}</div>
                    </div>
                    <div className="roomCategoryList--actions">
                        <button className="btn" onClick={props.onEdit.bind(this, roomCategory._id)}>Edit</button>
                        <button className="btn" onClick={props.onDelete.bind(this, roomCategory._id)}>Delete</button>
                    </div>
                </li>
            );
        })}
    </ul>
)

export default RoomCategoryList;