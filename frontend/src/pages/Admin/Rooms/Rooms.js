import React, { Component } from 'react';

import AuthContext from '../../../context/auth-context';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';
import RoomList from '../../../components/RoomList/RoomList';

class RoomsPage extends Component {
    state = {
        isLoading: false,
        isEditing: false,
        isCreating: false,
        roomData: [],
        selectedRoomObj: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.roomNameElRef = React.createRef();
        this.roomDescElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchData();
    };

    fetchData = () => {
        this.setState({isLoading: true});

        fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms`, {
            method: 'GET',
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
            this.setState({roomData: resData.rooms, isLoading: false});
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    };

    deleteHandler = roomID => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms/${roomID}`, {
                method: 'DELETE',
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
                this.setState(prevState => {
                    const updatedRoomData = prevState.roomData.filter(roomItem => {
                        return roomItem._id !== roomID;
                    });
                    return { roomData: updatedRoomData, selectedRoomObj: null, isEditing: false };
                });

            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
            });
        }
    };

    createHandler = () => {
        this.setState({selectedRoomObj: null, isCreating: true});
    }

    editHandler = roomID => {
        this.setState(prevState => {
            const selectedRoom = prevState.roomData.find(e => e._id === roomID);
            return {selectedRoomObj: selectedRoom, isEditing: true};
        });
    }

    modalConfirmHandler = () => {
        const name = this.roomNameElRef.current.value;
        const description = this.roomDescElRef.current.value;

        if (name.trim().length === 0 || description.trim().length === 0 ) {
            return;
        }

        if (this.state.isCreating) {
            const requestBody = {
                name: name,
                description: description
            };

            fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms/`, {
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
                this.setState(prevState => {
                    let updatedRoomData = [];
                    if (prevState.roomData && prevState.roomData.length > 0) {
                        updatedRoomData = [...prevState.roomData];
                    }

                    updatedRoomData.push({
                        _id: resData.createdRoom._id,
                        name: resData.createdRoom.name,
                        description: resData.createdRoom.description,
                    });
                    return { roomData: updatedRoomData, selectedRoomObj: null, isEditing: false, isCreating: false };
                });
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
            });

        }
        else if (this.state.isEditing) {
            const roomID = this.state.selectedRoomObj._id;

            const requestBody = {
                _id: roomID,
                name: name,
                description: description
            };

            fetch(`http://${process.env.REACT_APP_API_SERVER}/rooms/${roomID}`, {
                method: 'PATCH',
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
                this.setState(prevState => {
                    const updatedRoomData = prevState.roomData.map(el => el._id === resData.updatedRoom._id ? { 
                        ...el, 
                        name: resData.updatedRoom.name,
                        description: resData.updatedRoom.description,
                    }: el);
                    return { roomData: updatedRoomData, selectedRoomObj: null, isEditing: false };
                });
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
            });
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
                    <RoomList 
                        data={this.state.roomData} 
                        onDelete={this.deleteHandler}
                        onEdit={this.editHandler}
                    />

                    { 
                        (this.state.isEditing && this.state.selectedRoomObj) &&
                        <Modal title="Edit Room" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomName">Room Name:</label>
                                    <input type="text" id="roomName" ref={this.roomNameElRef} defaultValue={this.state.selectedRoomObj.name}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomDesc">Room Description:</label>
                                    <input type="text" id="roomDesc" ref={this.roomDescElRef} defaultValue={this.state.selectedRoomObj.description}></input>
                                </div>
                            </form>
                        </Modal>
                    } 

                    <button className="btn" onClick={this.createHandler}>Create New</button>

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Room" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomName">Room Name:</label>
                                    <input type="text" id="roomName" ref={this.roomNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomDesc">Room Description:</label>
                                    <input type="text" id="roomDesc" ref={this.roomDescElRef}></input>
                                </div>
                            </form>
                        </Modal>
                    } 
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    };
}

export default RoomsPage;