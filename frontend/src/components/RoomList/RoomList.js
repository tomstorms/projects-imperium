import React from 'react';

import './RoomList.css';

const RoomList = props => (
    <ul className="roomList">
        {props.data && props.data.length > 0 && props.data.map(room => {
            return (
                <li key={room._id} className="roomList--item">
                    <div className="roomList--data">
                        <div className="roomList--data-name">{room.name}</div>
                        <div className="roomList--data-description">{room.description}</div>
                    </div>
                    <div className="roomList--actions">
                        <button className="btn" onClick={props.onEdit.bind(this, room._id)}>Edit</button>
                        <button className="btn" onClick={props.onDelete.bind(this, room._id)}>Delete</button>
                    </div>
                </li>
            );
        })}
        { (!props.data || props.data.length===0) &&
        <p>There are no Rooms to display</p>
        }
    </ul>
)

export default RoomList;