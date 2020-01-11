import React, { Component } from 'react';

import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';

import ContactTable from '../../components/Table/ContactTable';
import TileList from '../../components/TileList/TileList';
import TileBlock from '../../components/Tiles/TileBlock/TileBlock';

import './Contacts.css';

export default class ContactsList extends Component {
    state = {
        isLoading: false,
        isEditing: false,
        isCreating: false,
        contactData: [],
        selectedContactObj: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.contactFirstNameElRef = React.createRef();
        this.contactLastNameElRef = React.createRef();
        this.contactEmailElRef = React.createRef();
    }

    componentDidMount() {
        this.getContacts();
    };

    getContacts = () => {
        const requestBody = {
            query: `
                query {
                    contacts {
                        _id
                        first_name
                        last_name
                        email
                    }
                }
            `,
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.contacts) {
                this.setState({contactData: resData.contacts});
            }
        });
    }

    createContact = (data) => {
        const requestBody = {
            query: `
                mutation CreateContact($firstName: String!, $lastName: String, $email: String!) {
                    createContact(contactInput:{
                        first_name: $firstName,
                        last_name: $lastName,
                        email: $email
                    }) {
                        _id
                        first_name
                        last_name
                        email
                    }
                }
            `,
            variables: {
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.createContact) {
                this.setState(prevState => {
                    let contactData = [];
                    if (prevState.contactData && prevState.contactData.length > 0) {
                        contactData = [...prevState.contactData];
                    }

                    contactData.push({
                        _id: resData.createContact._id,
                        first_name: resData.createContact.first_name,
                        last_name: resData.createContact.last_name,
                        email: resData.createContact.email,
                    });
                    return { contactData: contactData, selectedContactObj: null, isEditing: false, isCreating: false };
                });

            }
        });
    }

    updateContact = (contactId, data) => {
        const requestBody = {
            query: `
                mutation UpdateContact($id: ID!, $firstName: String!, $lastName: String, $email: String!) {
                    updateContact(contactInput:{
                        _id: $id,
                        first_name: $firstName,
                        last_name: $lastName,
                        email: $email
                    }) {
                        _id
                        first_name
                        last_name
                        email
                    }
                }
            `,
            variables: {
                id: contactId,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.updateContact) {
                this.setState(prevState => {
                    const updatedContactData = prevState.contactData.map(el => el._id === resData.updateContact._id ? { 
                        ...el, 
                        first_name: resData.updateContact.first_name,
                        last_name: resData.updateContact.last_name,
                        email: resData.updateContact.email,
                    }: el);
                    return { contactData: updatedContactData };
                });
                this.setState({selectedContactObj: null, isEditing: false });
            }
        });
    }

    deleteContact = (contactId) => {
        const requestBody = {
            query: `
                mutation DeleteContact($id: ID!) {
                    deleteContact(contactInput:{
                        _id: $id,
                    })
                }
            `,
            variables: {
                id: contactId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.deleteContact) {
                this.setState(prevState => {
                    const contactData = prevState.contactData.filter(contactItem => {
                        return contactItem._id !== contactId;
                    });
                    return { contactData: contactData, selectedContactObj: null, isEditing: false };
                });
            }
        });
    }

    fetchData = (requestBody, callback) => {
        this.setState({isLoading: true});

        fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            if (resData.errors) {
                throw new Error(resData.errors[0].message);
            }

            if (resData.data) {
                this.setState({isLoading: false});
                callback(resData.data);
            }
            else {
                throw new Error('Unable to load data');
            }
            
        }).catch(err => {
            this.setState({isLoading: false});
            return;
        });
    };

    createHandler = () => {
        this.setState({selectedContactObj: null, isCreating: true});
    }

    editHandler = estId => {
        this.setState(prevState => {
            const selected = prevState.contactData.find(e => e._id === estId);
            return { selectedContactObj: selected, isEditing: true};
        });
    }

    deleteHandler = estId => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            this.deleteContact(estId);
        }
    };

    modalConfirmHandler = () => {
        const firstName = this.contactFirstNameElRef.current.value;
        const lastName = this.contactLastNameElRef.current.value;
        const email = this.contactEmailElRef.current.value;

        if (firstName.trim().length === 0 || email.trim().length === 0) {
            return;
        }

        if (this.state.isCreating) {
            const requestBody = {
                first_name: firstName,
                last_name: lastName,
                email: email,
            };
            this.createContact(requestBody);
        }
        else if (this.state.isEditing) {
            const contactId = this.state.selectedContactObj._id;
            const requestBody = {
                first_name: firstName,
                last_name: lastName,
                email: email,
            };
            this.updateContact(contactId, requestBody);
        }
    }

    modalCancelHandler = () => {
        this.setState({selectedContactObj: null, isEditing: false, isCreating: false});
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {



            content = (
                <React.Fragment>
                    <TileList col="1">
                        <TileBlock heading="All Contacts" tileClass="tile-rooms">
                            <button className="btn btn-primary btn--new" onClick={this.createHandler}>Create New</button>
                            <ContactTable 
                                data={this.state.contactData}
                                onDelete={ (this.context.userRole === 'superadmin') ? this.deleteHandler : null }
                                onEdit={ (this.context.userRole === 'superadmin') ? this.editHandler : null }
                                onCreate={ (this.context.userRole === 'superadmin') ? this.createHandler : null }
                            />
                        </TileBlock>
                    </TileList>

                    { 
                        (this.state.isEditing && this.state.selectedContactObj) &&
                        <Modal title="Edit Contact" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="contactFirstName">First Name:</label>
                                    <input type="text" id="contactFirstName" ref={this.contactFirstNameElRef} defaultValue={this.state.selectedContactObj.first_name}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="contactLastName">Last Name:</label>
                                    <input type="text" id="contactLastName" ref={this.contactLastNameElRef} defaultValue={this.state.selectedContactObj.last_name}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="contactEmail">Email Address:</label>
                                    <input type="email" id="contactEmail" ref={this.contactEmailElRef} defaultValue={this.state.selectedContactObj.email}></input>
                                </div>
                            </form>
                        </Modal>
                    } 

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Contact" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="contactFirstName">First Name:</label>
                                    <input type="text" id="contactFirstName" ref={this.contactFirstNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="contactLastName">Last Name:</label>
                                    <input type="text" id="contactLastName" ref={this.contactLastNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="contactEmail">Email Address:</label>
                                    <input type="email" id="contactEmail" ref={this.contactEmailElRef}></input>
                                </div>
                            </form>
                        </Modal>
                    } 
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <div className="page page--dashboard">
                    <section className="section section--heading">
                        <h1 className="page-title">Contacts</h1>
                    </section>
                    {content}
                </div>
            </React.Fragment>
        );
    };
}

