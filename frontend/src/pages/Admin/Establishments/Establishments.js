import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../../context/auth-context';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';

import EstablishmentTable from '../../../components/Table/EstablishmentTable';
import TileList from '../../../components/TileList/TileList';
import TileBlock from '../../../components/Tiles/TileBlock/TileBlock';

import './Establishments.css';

class EstablishmentsPage extends Component {
    state = {
        isLoading: false,
        isEditing: false,
        isCreating: false,
        estData: [],
        selectedEstObj: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.estNameElRef = React.createRef();
        this.roomDescElRef = React.createRef();
    }

    componentDidMount() {
        this.getEstablishments();
    };

    getEstablishments = () => {
        const requestBody = {
            query: `
                query {
                    establishments {
                        _id
                        name
                    }
                }
            `,
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.establishments) {
                this.setState({estData: resData.establishments});
            }
        });
    }

    createEstablishment = (data) => {
        const requestBody = {
            query: `
                mutation CreateEstablishment($name: String!) {
                    createEstablishment(establishmentInput:{
                        name: $name
                    }) {
                        _id
                        name
                    }
                }
            `,
            variables: {
                name: data.name,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.createEstablishment) {
                this.setState(prevState => {
                    let estData = [];
                    if (prevState.estData && prevState.estData.length > 0) {
                        estData = [...prevState.estData];
                    }

                    estData.push({
                        _id: resData.createEstablishment._id,
                        name: resData.createEstablishment.name,
                    });
                    return { estData: estData, selectedEstObj: null, isEditing: false, isCreating: false };
                });

            }
        });
    }

    updateEstablishment = (estId, data) => {
        const requestBody = {
            query: `
                mutation UpdateEstablishment($id: ID!, $name: String!) {
                    updateEstablishment(establishmentInput:{
                        _id: $id,
                        name: $name
                    }) {
                        _id
                        name
                    }
                }
            `,
            variables: {
                id: estId,
                name: data.name,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.updateEstablishment) {
                this.setState(prevState => {
                    const updatedEstData = prevState.estData.map(el => el._id === resData.updateEstablishment._id ? { 
                        ...el, 
                        name: resData.updateEstablishment.name,
                    }: el);
                    return { estData: updatedEstData };
                });
                this.setState({selectedEstObj: null, isEditing: false });
            }
        });
    }

    deleteEstablishment = (estId) => {
        const requestBody = {
            query: `
                mutation DeleteEstablishment($id: ID!) {
                    deleteEstablishment(establishmentInput:{
                        _id: $id,
                    })
                }
            `,
            variables: {
                id: estId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.deleteEstablishment) {
                this.setState(prevState => {
                    const estData = prevState.estData.filter(estItem => {
                        return estItem._id !== estId;
                    });
                    return { estData: estData, selectedEstObj: null, isEditing: false };
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
        this.setState({selectedEstObj: null, isCreating: true});
    }

    editHandler = estId => {
        this.setState(prevState => {
            const selected = prevState.estData.find(e => e._id === estId);
            return { selectedEstObj: selected, isEditing: true};
        });
    }

    deleteHandler = estId => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            this.deleteEstablishment(estId);
        }
    };

    modalConfirmHandler = () => {
        const name = this.estNameElRef.current.value;

        if (name.trim().length === 0) {
            return;
        }

        if (this.state.isCreating) {
            const requestBody = {
                name: name,
            };
            this.createEstablishment(requestBody);
        }
        else if (this.state.isEditing) {
            const estId = this.state.selectedEstObj._id;
            const requestBody = {
                name: name,
            };
            this.updateEstablishment(estId, requestBody);
        }
    }

    modalCancelHandler = () => {
        this.setState({selectedEstObj: null, isEditing: false, isCreating: false});
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <TileList col="1">
                        <TileBlock heading="All Establishments" tileClass="tile-establishments">
                            <button className="btn btn-primary btn--new" onClick={this.createHandler}>Create New</button>
                            <EstablishmentTable 
                                data={this.state.estData}
                                onDelete={this.deleteHandler}
                                onEdit={this.editHandler}
                                onCreate={this.createHandler}
                            />
                        </TileBlock>
                    </TileList>

                    { 
                        (this.state.isEditing && this.state.selectedEstObj) &&
                        <Modal title="Edit Establishment" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="estName">Establishment Name:</label>
                                    <input type="text" id="estName" ref={this.estNameElRef} defaultValue={this.state.selectedEstObj.name}></input>
                                </div>
                            </form>
                        </Modal>
                    } 

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Establishment" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="estName">Establishment Name:</label>
                                    <input type="text" id="estName" ref={this.estNameElRef}></input>
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
                        <h1 className="page-title">Establishments</h1>
                    </section>
                    {content}
                    <section className="section section--footer">
                        <NavLink to="/admin">Back to Settings</NavLink>    
                    </section>
                </div>
            </React.Fragment>
        );
    };
}

export default EstablishmentsPage;