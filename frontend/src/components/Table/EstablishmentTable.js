import React from 'react';

import './Table.css';

const headers = ['Name'];

const EstablishmentTable = props => (
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
                    { props.data.map((estData,index) => {
                        return (
                            <tr key={index}>
                                <td>{estData.name}</td>
                                <td className="actions">
                                    <button className="btn btn--edit" onClick={props.onEdit.bind(this, estData._id)}>Edit</button>
                                    <button className="btn btn--delete" onClick={props.onDelete.bind(this, estData._id)}>Delete</button>
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
export default EstablishmentTable;