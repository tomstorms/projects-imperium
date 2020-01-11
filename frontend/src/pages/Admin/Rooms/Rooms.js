import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../../context/auth-context';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';
import Alert from '../../../components/Alert/Alert';

import RoomTable from '../../../components/Table/RoomTable';
import TileList from '../../../components/TileList/TileList';
import TileBlock from '../../../components/Tiles/TileBlock/TileBlock';

import './Rooms.css';

class RoomsPage extends Component {
    state = {
        isLoading: false,
        isEditing: false,
        isCreating: false,
        roomCategoryData: [],
        roomData: [],
        selectedRoomObj: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.roomNameElRef = React.createRef();
        this.roomDescriptionElRef = React.createRef();
        this.roomCategoryIdElRef = React.createRef();
    }

    componentDidMount() {
        this.getRoomCategories();
        this.getRooms();
    };

    getRoomCategories = () => {
        const requestBody = {
            query: `
                query {
                    room_category {
                        _id
                        name
                        price
                        establishment {
                            _id
                            name
                        }
                    }
                }
            `,
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.room_category) {
                this.setState({roomCategoryData: resData.room_category});
            }
        });
    }

    getRooms = () => {
        const requestBody = {
            query: `
                query {
                    rooms {
                        _id
                        name
                        description
                        room_category {
                            _id
                            name
                            price
                            establishment { 
                                name
                            }
                        }
                    }
                }
            `,
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.rooms) {
                this.setState({roomData: resData.rooms});
            }
        });
    }

    createRoom = (data) => {
        const requestBody = {
            query: `
                mutation CreateRoom($name: String!, $description: String!, $roomCategoryId: String!) {
                    createRoom(roomInput:{
                        name: $name,
                        description: $description,
                        room_category_id: $roomCategoryId
                    }) {
                        _id
                        name
                        description
                        room_category {
                            _id
                            name
                            price
                            establishment {
                                _id
                                name
                            }
                        }
                    }
                }
            `,
            variables: {
                name: data.name,
                description: data.description,
                roomCategoryId: data.roomCategoryId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.createRoom) {
                this.setState(prevState => {
                    let roomData = [];
                    if (prevState.roomData && prevState.roomData.length > 0) {
                        roomData = [...prevState.roomData];
                    }

                    roomData.push({
                        _id: resData.createRoom._id,
                        name: resData.createRoom.name,
                        description: resData.createRoom.description,
                        room_category: resData.createRoom.room_category,
                    });
                    return { roomData: roomData, selectedRoomObj: null, isEditing: false, isCreating: false };
                });

            }
        });
    }

    updateRoom = (roomCategoryId, data) => {
        const requestBody = {
            query: `
                mutation UpdateRoom($id: ID!, $name: String!, $description: String, $roomCategoryID: String!) {
                    updateRoom(roomInput:{
                        _id: $id,
                        name: $name,
                        description: $description,
                        room_category_id: $roomCategoryID
                    }) {
                        _id
                        name
                        description
                        room_category {
                            _id
                            name
                            price
                            establishment {
                                _id
                                name
                            }
                        }
                    }
                }
            `,
            variables: {
                id: roomCategoryId,
                name: data.name,
                description: data.description,
                roomCategoryID: data.roomCategoryId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.updateRoom) {
                this.setState(prevState => {
                    const updatedRoomData = prevState.roomData.map(el => el._id === resData.updateRoom._id ? { 
                        ...el, 
                        name: resData.updateRoom.name,
                        description: resData.updateRoom.description,
                        room_category: resData.updateRoom.room_category,
                    }: el);
                    return { roomData: updatedRoomData };
                });
                this.setState({selectedRoomObj: null, isEditing: false });
            }
        });
    }

    deleteRoom = (roomId) => {
        const requestBody = {
            query: `
                mutation DeleteRoom($id: ID!) {
                    deleteRoom(roomInput:{
                        _id: $id,
                    })
                }
            `,
            variables: {
                id: roomId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.deleteRoom) {
                this.setState(prevState => {
                    const roomData = prevState.roomData.filter(roomItem => {
                        return roomItem._id !== roomId;
                    });
                    return { roomData: roomData, selectedRoomObj: null, isEditing: false };
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
        this.setState({selectedRoomObj: null, isCreating: true});
    }

    editHandler = estId => {
        this.setState(prevState => {
            const selected = prevState.roomData.find(e => e._id === estId);
            return { selectedRoomObj: selected, isEditing: true};
        });
    }

    deleteHandler = estId => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            this.deleteRoom(estId);
        }
    };

    modalConfirmHandler = () => {
        const name = this.roomNameElRef.current.value;
        const description = this.roomDescriptionElRef.current.value;
        const roomCategoryId = this.roomCategoryIdElRef.current.value;

        if (name.trim().length === 0) {
            return;
        }

        if (this.state.isCreating) {
            const requestBody = {
                name: name,
                description: description,
                roomCategoryId: roomCategoryId,
            };
            this.createRoom(requestBody);
        }
        else if (this.state.isEditing) {
            const roomId = this.state.selectedRoomObj._id;
            const requestBody = {
                name: name,
                description: description,
                roomCategoryId: roomCategoryId,
            };
            this.updateRoom(roomId, requestBody);
        }
    }

    modalCancelHandler = () => {
        this.setState({selectedRoomObj: null, isEditing: false, isCreating: false});
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <TileList col="1">
                        <TileBlock heading="All Rooms" tileClass="tile-rooms">
                            <button className="btn btn-primary btn--new" onClick={this.createHandler}>Create New</button>
                            <RoomTable 
                                data={this.state.roomData}
                                onDelete={ (this.context.userRole === 'superadmin') ? this.deleteHandler : null }
                                onEdit={ (this.context.userRole === 'superadmin') ? this.editHandler : null }
                                onCreate={ (this.context.userRole === 'superadmin') ? this.createHandler : null }
                            />
                        </TileBlock>
                    </TileList>

                    { 
                        (this.state.isEditing && this.state.selectedRoomObj) &&
                        <Modal title="Edit Room" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomName">Room Name:</label>
                                    <input type="text" id="roomName" ref={this.roomNameElRef} defaultValue={this.state.selectedRoomObj.name}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomDescription">Room Description:</label>
                                    <input type="text" id="roomDescription" ref={this.roomDescriptionElRef} defaultValue={this.state.selectedRoomObj.description}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryId">Room Category:</label>
                                    <select ref={this.roomCategoryIdElRef} defaultValue={this.state.selectedRoomObj.room_category._id}>
                                        { this.state.roomCategoryData.map((roomCategory,index) => {
                                            return (
                                                <option key={index} value={roomCategory._id}>{roomCategory.establishment.name} - {roomCategory.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </form>
                        </Modal>
                    } 

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Room" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomName">Room Name:</label>
                                    <input type="text" id="roomName" ref={this.roomNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomDescription">Room Description:</label>
                                    <input type="text" id="roomDescription" ref={this.roomDescriptionElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryId">Room Category:</label>
                                    <select ref={this.roomCategoryIdElRef}>
                                        { this.state.roomCategoryData.map((roomCategory,index) => {
                                            return (
                                                <option key={index} value={roomCategory._id}>{roomCategory.establishment.name} - {roomCategory.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </form>
                        </Modal>
                    } 
                </React.Fragment>
            );

            if (this.context.userRole !== 'superadmin') {
                content = (
                    <section className="section section--error">
                        <Alert message="You must be a superadmin to access this page." ></Alert>
                    </section>
                )
            }
        }

        return (
            <React.Fragment>
                <div className="page page--dashboard">
                    <section className="section section--heading">
                        <h1 className="page-title">Rooms</h1>
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

export default RoomsPage;