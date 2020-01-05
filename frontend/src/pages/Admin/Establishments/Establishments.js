import React, { Component } from 'react';

import AuthContext from '../../../context/auth-context';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';
import RoomList from '../../../components/RoomList/RoomList';

import EstablishmentTable from '../../../components/Table/Establishments/EstablishmentTable';
import TileList from '../../../components/TileList/TileList';
import TileBlock from '../../../components/Tiles/TileBlock/TileBlock';

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

        this.fetchData(requestBody, 'GET', (resData, err) => {
            if (resData.establishments) {
                this.setState({estData: resData.establishments});
            }
        });
    }

    saveEstablishment = () => {
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

    fetchData = (requestBody, method, callback) => {
        this.setState({isLoading: true});

        fetch(`${process.env.REACT_APP_API_SERVER}/graphql`, {
            method: method,
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
            console.log(err.message);
            this.setState({isLoading: false});
            return;
        });
    };

    deleteHandler = estId => {
        console.log('delete handler');
        console.log(estId);
    //     var confirmModal = window.confirm("Are you sure you want to delete this item?");
    //     if (confirmModal === true) {
    //         fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms/${estId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + this.context.token,
    //             }
    //         }).then(res => {
    //             if (res.status !== 200 && res.status !== 201) {
    //                 throw new Error('Failed!');
    //             }
    //             return res.json();
    //         }).then(resData => {
    //             this.setState(prevState => {
    //                 const updatedRoomData = prevState.roomData.filter(roomItem => {
    //                     return roomItem._id !== estId;
    //                 });
    //                 return { estData: updatedRoomData, selectedEstObj: null, isEditing: false };
    //             });

    //         }).catch(err => {
    //             console.log(err);
    //             this.setState({isLoading: false});
    //         });
    //     }
    };

    // createHandler = () => {
    //     this.setState({selectedEstObj: null, isCreating: true});
    // }

    editHandler = estId => {
        console.log('editHandler');
        console.log(estId);
        this.setState(prevState => {
            const selectedEst = prevState.estData.find(e => e._id === estId);
            return {selectedEstObj: selectedEst, isEditing: true};
        });
    }

    modalConfirmHandler = () => {
        console.log('modalConfirmHandler');
        const name = this.estNameElRef.current.value;

        if (name.trim().length === 0) {
            return;
        }

    //     if (this.state.isCreating) {
    //         const requestBody = {
    //             name: name,
    //             description: description
    //         };

    //         fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms/`, {
    //             method: 'POST',
    //             body: JSON.stringify(requestBody),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + this.context.token,
    //             }
    //         }).then(res => {
    //             if (res.status !== 200 && res.status !== 201) {
    //                 throw new Error('Failed!');
    //             }
    //             return res.json();
    //         }).then(resData => {
    //             this.setState(prevState => {
    //                 let updatedRoomData = [];
    //                 if (prevState.roomData && prevState.roomData.length > 0) {
    //                     updatedRoomData = [...prevState.roomData];
    //                 }

    //                 updatedRoomData.push({
    //                     _id: resData.createdRoom._id,
    //                     name: resData.createdRoom.name,
    //                     description: resData.createdRoom.description,
    //                 });
    //                 return { estData: updatedRoomData, selectedEstObj: null, isEditing: false, isCreating: false };
    //             });
    //         }).catch(err => {
    //             console.log(err);
    //             this.setState({isLoading: false});
    //         });

    //     }
    //     else if (this.state.isEditing) {
    //         const estId = this.state.selectedEstObj._id;

    //         const requestBody = {
    //             _id: estId,
    //             name: name,
    //             description: description
    //         };

    //         fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms/${estId}`, {
    //             method: 'PATCH',
    //             body: JSON.stringify(requestBody),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + this.context.token,
    //             }
    //         }).then(res => {
    //             if (res.status !== 200 && res.status !== 201) {
    //                 throw new Error('Failed!');
    //             }
    //             return res.json();
    //         }).then(resData => {
    //             this.setState(prevState => {
    //                 const updatedRoomData = prevState.roomData.map(el => el._id === resData.updatedRoom._id ? { 
    //                     ...el, 
    //                     name: resData.updatedRoom.name,
    //                     description: resData.updatedRoom.description,
    //                 }: el);
    //                 return { estData: updatedRoomData, selectedEstObj: null, isEditing: false };
    //             });
    //         }).catch(err => {
    //             console.log(err);
    //             this.setState({isLoading: false});
    //         });
    //     }
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
                        <TileBlock heading="Available Establishments">
                            <EstablishmentTable 
                                data={this.state.estData} 
                                onDelete={this.deleteHandler}
                                onEdit={this.editHandler}
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

                    {/*
                    <button className="btn" onClick={this.createHandler}>Create New</button>

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Room" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="estName">Room Name:</label>
                                    <input type="text" id="estName" ref={this.estNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomDesc">Room Description:</label>
                                    <input type="text" id="roomDesc" ref={this.roomDescElRef}></input>
                                </div>
                            </form>
                        </Modal>
                    }  */}
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
                </div>
            </React.Fragment>
        );
    };
}

export default EstablishmentsPage;