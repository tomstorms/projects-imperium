import React from 'react';

import './Table.css';

import IconEdit from './Icons/icon-edit.svg';
import IconDelete from './Icons/icon-delete.svg';

const headers = ['First Name', 'Last Name', 'Email'];

const ContactTable = props => (
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
                    { props.data.map((contactData,index) => {
                        return (
                            <tr key={index}>
                                <td>{contactData.first_name}</td>
                                <td>{contactData.last_name}</td>
                                <td>{contactData.email}</td>
                                <td className="actions">
                                    <button className="btn btn--edit" onClick={props.onEdit.bind(this, contactData._id)}><img src={IconEdit} alt="Edit" /></button>
                                    <button className="btn btn--delete" onClick={props.onDelete.bind(this, contactData._id)}><img src={IconDelete} alt="Edit" /></button>
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
export default ContactTable;