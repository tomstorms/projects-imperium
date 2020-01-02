import React, { Component } from 'react';

import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';
import RoomCategoryList from '../../components/RoomCategoryList/RoomCategoryList';

class RoomCategoryPage extends Component {
    state = {
        isLoading: false,
        isEditing: false,
        isCreating: false,
        roomCategoryData: [],
        selectedRoomCategoryObj: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.roomCategoryNameElRef = React.createRef();
        this.roomCategoryPriceElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchData();
    };

    fetchData = () => {
        this.setState({isLoading: true});

        fetch(`http://${process.env.REACT_APP_API_SERVER}/room-category`, {
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
            this.setState({roomCategoryData: resData.data, isLoading: false});
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    };

    deleteHandler = roomCategoryID => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            fetch(`http://${process.env.REACT_APP_API_SERVER}/room-category/${roomCategoryID}`, {
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
                    const updatedRoomCategoryData = prevState.roomCategoryData.filter(roomCategoryItem => {
                        return roomCategoryItem._id !== roomCategoryID;
                    });
                    return { roomCategoryData: updatedRoomCategoryData, selectedRoomCategoryObj: null, isEditing: false };
                });

            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
            });
        }
    };

    createHandler = () => {
        this.setState({selectedRoomCategoryObj: null, isCreating: true});
    }

    editHandler = roomCategoryID => {
        this.setState(prevState => {
            const selectedRoomCategory = prevState.roomCategoryData.find(e => e._id === roomCategoryID);
            console.log(selectedRoomCategory);
            return {selectedRoomCategoryObj: selectedRoomCategory, isEditing: true};
        });
    }

    modalConfirmHandler = () => {
        const name = this.roomCategoryNameElRef.current.value;
        const price = +this.roomCategoryPriceElRef.current.value;

        if (name.trim().length === 0 || price <= 0) {
            return;
        }

        if (this.state.isCreating) {
            const requestBody = {
                name: name,
                price: price
            };

            fetch(`http://${process.env.REACT_APP_API_SERVER}/room-category/`, {
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
                    let updatedRoomCategoryData = [];
                    if (prevState.roomCategoryData && prevState.roomCategoryData.length > 0) {
                        updatedRoomCategoryData = [...prevState.roomCategoryData];
                    }

                    updatedRoomCategoryData.push({
                        _id: resData.createdRoomCategory._id,
                        name: resData.createdRoomCategory.name,
                        price: resData.createdRoomCategory.price,
                    });
                    return { roomCategoryData: updatedRoomCategoryData, selectedRoomCategoryObj: null, isEditing: false, isCreating: false };
                });
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
            });

        }
        else if (this.state.isEditing) {
            const roomCategoryID = this.state.selectedRoomCategoryObj._id;

            const requestBody = {
                _id: roomCategoryID,
                name: name,
                price: price
            };

            fetch(`http://${process.env.REACT_APP_API_SERVER}/room-category/${roomCategoryID}`, {
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
                    const updatedRoomCategoryData = prevState.roomCategoryData.map(el => el._id === resData.updatedRoomCategory._id ? { 
                        ...el, 
                        name: resData.updatedRoomCategory.name,
                        price: resData.updatedRoomCategory.price,
                    }: el);
                    return { roomCategoryData: updatedRoomCategoryData, selectedRoomCategoryObj: null, isEditing: false };
                });
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false});
            });
        }
    }

    modalCancelHandler = () => {
        this.setState({selectedRoomCategoryObj: null, isEditing: false, isCreating: false});
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <RoomCategoryList 
                        data={this.state.roomCategoryData} 
                        onDelete={this.deleteHandler}
                        onEdit={this.editHandler}
                    />

                    { 
                        (this.state.isEditing && this.state.selectedRoomCategoryObj) &&
                        <Modal title="Edit Room Category" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryName">Room Category Name:</label>
                                    <input type="text" id="roomCategoryName" ref={this.roomCategoryNameElRef} defaultValue={this.state.selectedRoomCategoryObj.name}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryPrice">Price</label>
                                    <input type="number" id="roomCategoryPrice" ref={this.roomCategoryPriceElRef} defaultValue={this.state.selectedRoomCategoryObj.price}></input>
                                </div>
                            </form>
                        </Modal>
                    } 

                    <button className="btn" onClick={this.createHandler}>Create New</button>

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Room Category" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryName">Room Category Name:</label>
                                    <input type="text" id="roomCategoryName" ref={this.roomCategoryNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryPrice">Price</label>
                                    <input type="number" id="roomCategoryPrice" ref={this.roomCategoryPriceElRef}></input>
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

export default RoomCategoryPage;