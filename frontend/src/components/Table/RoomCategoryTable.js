import React from 'react';

import './Table.css';

import IconEdit from './Icons/icon-edit.svg';
import IconDelete from './Icons/icon-delete.svg';

const headers = ['Name', 'Price', 'Establishment'];

const RoomCategoryTable = props => (
    <React.Fragment>
        {(props.data && props.data.length > 0) && (
        <React.Fragment>
            <table className="table">
                <thead>
                    <tr>
                        { headers.map((heading,index) => {
                            return (
                                <th key={index}>{heading}</th>
                            )
                        })}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { props.data.map((roomCategoryData,index) => {
                        return (
                            <tr key={index}>
                                <td>{roomCategoryData.name}</td>
                                <td>{roomCategoryData.price}</td>
                                <td>{roomCategoryData.establishment.name}</td>
                                <td className="actions">
                                    <button className="btn btn--edit" onClick={props.onEdit.bind(this, roomCategoryData._id)}><img src={IconEdit} alt="Edit" /></button>
                                    <button className="btn btn--delete" onClick={props.onDelete.bind(this, roomCategoryData._id)}><img src={IconDelete} alt="Edit" /></button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </React.Fragment>
        )}

        { (!props.data || props.data.length===0) &&
            <p>There is no data to display</p>
        }
    </React.Fragment>
)
export default RoomCategoryTable;