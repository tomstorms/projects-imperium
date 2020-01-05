import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../../context/auth-context';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';

import RoomCategoryTable from '../../../components/Table/RoomCategoryTable';
import TileList from '../../../components/TileList/TileList';
import TileBlock from '../../../components/Tiles/TileBlock/TileBlock';

import './RoomCategory.css';

class RoomCategoryPage extends Component {
    state = {
        isLoading: false,
        isEditing: false,
        isCreating: false,
        estData: [],
        roomCategoryData: [],
        selectedRoomCategoryObj: null,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.roomCategoryNameElRef = React.createRef();
        this.roomCategoryPriceElRef = React.createRef();
        this.roomCategoryEstIdElRef = React.createRef();
    }

    componentDidMount() {
        this.getEstablishments();
        this.getRoomCategories();
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

    createRoomCategory = (data) => {
        const requestBody = {
            query: `
                mutation CreateRoomCategory($name: String!, $price: Float!, $estId: String!) {
                    createRoomCategory(roomCategoryInput:{
                        name: $name,
                        price: $price,
                        establishment_id: $estId
                    }) {
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
            variables: {
                name: data.name,
                price: +data.price,
                estId: data.estId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.createRoomCategory) {
                this.setState(prevState => {
                    let roomCategoryData = [];
                    if (prevState.roomCategoryData && prevState.roomCategoryData.length > 0) {
                        roomCategoryData = [...prevState.roomCategoryData];
                    }

                    roomCategoryData.push({
                        _id: resData.createRoomCategory._id,
                        name: resData.createRoomCategory.name,
                        price: resData.createRoomCategory.price,
                        establishment: resData.createRoomCategory.establishment,
                    });
                    return { roomCategoryData: roomCategoryData, selectedRoomCategoryObj: null, isEditing: false, isCreating: false };
                });

            }
        });
    }

    updateRoomCategory = (roomCategoryId, data) => {
        const requestBody = {
            query: `
                mutation UpdateRoomCategory($id: ID!, $name: String, $price: Float, $estId: String) {
                    updateRoomCategory(roomCategoryInput:{
                        _id: $id,
                        name: $name,
                        price: $price,
                        establishment_id: $estId
                    }) {
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
            variables: {
                id: roomCategoryId,
                name: data.name,
                price: +data.price,
                estId: data.estId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.updateRoomCategory) {
                this.setState(prevState => {
                    const updatedRoomCategoryData = prevState.roomCategoryData.map(el => el._id === resData.updateRoomCategory._id ? { 
                        ...el, 
                        name: resData.updateRoomCategory.name,
                        price: resData.updateRoomCategory.price,
                        establishment: resData.updateRoomCategory.establishment,
                    }: el);
                    return { roomCategoryData: updatedRoomCategoryData };
                });
                this.setState({selectedRoomCategoryObj: null, isEditing: false });
            }
        });
    }

    deleteRoomCategory = (roomCategoryId) => {
        const requestBody = {
            query: `
                mutation DeleteRoomCategory($id: ID!) {
                    deleteRoomCategory(roomCategoryInput:{
                        _id: $id,
                    })
                }
            `,
            variables: {
                id: roomCategoryId,
            }
        };

        this.fetchData(requestBody, (resData, err) => {
            if (resData.deleteRoomCategory) {
                this.setState(prevState => {
                    const roomCategoryData = prevState.roomCategoryData.filter(roomCategoryItem => {
                        return roomCategoryItem._id !== roomCategoryId;
                    });
                    return { roomCategoryData: roomCategoryData, selectedRoomCategoryObj: null, isEditing: false };
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
        this.setState({selectedRoomCategoryObj: null, isCreating: true});
    }

    editHandler = estId => {
        this.setState(prevState => {
            const selected = prevState.roomCategoryData.find(e => e._id === estId);
            return { selectedRoomCategoryObj: selected, isEditing: true};
        });
    }

    deleteHandler = estId => {
        var confirmModal = window.confirm("Are you sure you want to delete this item?");
        if (confirmModal === true) {
            this.deleteRoomCategory(estId);
        }
    };

    modalConfirmHandler = () => {
        const name = this.roomCategoryNameElRef.current.value;
        const price = this.roomCategoryPriceElRef.current.value;
        const estId = this.roomCategoryEstIdElRef.current.value;

        if (name.trim().length === 0) {
            return;
        }

        if (this.state.isCreating) {
            const requestBody = {
                name: name,
                price: price,
                estId: estId,
            };
            this.createRoomCategory(requestBody);
        }
        else if (this.state.isEditing) {
            const roomCategoryId = this.state.selectedRoomCategoryObj._id;
            const requestBody = {
                name: name,
                price: price,
                estId: estId,
            };
            this.updateRoomCategory(roomCategoryId, requestBody);
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
                    <TileList col="1">
                        <TileBlock heading="All Room Categories" tileClass="tile-roomcategory">
                            <button className="btn btn-primary btn--new" onClick={this.createHandler}>Create New</button>
                            <RoomCategoryTable 
                                data={this.state.roomCategoryData}
                                onDelete={this.deleteHandler}
                                onEdit={this.editHandler}
                                onCreate={this.createHandler}
                            />
                        </TileBlock>
                    </TileList>

                    { 
                        (this.state.isEditing && this.state.selectedRoomCategoryObj) &&
                        <Modal title="Edit Room Category" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryName">Room Category Name:</label>
                                    <input type="text" id="roomCategoryName" ref={this.roomCategoryNameElRef} defaultValue={this.state.selectedRoomCategoryObj.name}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryPrice">Price:</label>
                                    <input type="number" id="roomCategoryPrice" ref={this.roomCategoryPriceElRef} defaultValue={this.state.selectedRoomCategoryObj.price}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryEstId">Establishment:</label>
                                    <select ref={this.roomCategoryEstIdElRef} defaultValue={this.state.selectedRoomCategoryObj.establishment._id}>
                                        { this.state.estData.map((estData,index) => {
                                            return (
                                                <option key={index} value={estData._id}>{estData.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </form>
                        </Modal>
                    } 

                    { 
                        (this.state.isCreating) &&
                        <Modal title="Add a new Room Category" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryName">Room Category Name:</label>
                                    <input type="text" id="roomCategoryName" ref={this.roomCategoryNameElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryPrice">Price:</label>
                                    <input type="number" id="roomCategoryPrice" ref={this.roomCategoryPriceElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="roomCategoryEstId">Establishment:</label>
                                    <select ref={this.roomCategoryEstIdElRef}>
                                        { this.state.estData.map((estData,index) => {
                                            return (
                                                <option key={index} value={estData._id}>{estData.name}</option>
                                            )
                                        })}
                                    </select>
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
                        <h1 className="page-title">Room Categories</h1>
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

export default RoomCategoryPage;