import React, { Component } from 'react';

import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';
import RoomCategoryList from '../../components/RoomCategoryList/RoomCategoryList';

class RoomCategoryPage extends Component {
    state = {
        isLoading: false,
        data: [],
        isEditing: false,
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchData();
    };

    fetchData = () => {
        this.setState({isLoading: true});

        console.log('fetchData');
        console.log(this.context);
        console.log(this.context.token);

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
            this.setState({data: resData.data, isLoading: false});
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    };

    deleteHandler = roomCategoryID => {
        alert('Delete coming...');
        console.log('hello from deleteHandler');
        // this.setState({isLoading: true});

        // const requestBody = {
        //     query: `
        //         mutation CancelBooking($id: ID!) {
        //             cancelBooking(roomCategoryID: $id) {
        //                 _id
        //                 title
        //             }
        //         }
        //     `,
        //     variables: {
        //         id: roomCategoryID,
        //     }
        // };

        // fetch('http://localhost:8000/graphql', {
        //     method: 'POST',
        //     body: JSON.stringify(requestBody),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + this.context.token,
        //     }
        // }).then(res => {
        //     if (res.status !== 200 && res.status !== 201) {
        //         throw new Error('Failed!');
        //     }
        //     return res.json();
        // }).then(resData => {
        //     this.setState(prevState => {
        //         const updatedBookings = prevState.bookings.filter(booking => {
        //             return booking._id !== roomCategoryID;
        //         });
        //         return { bookings: updatedBookings, isLoading: false };
        //     });
        // }).catch(err => {
        //     console.log(err);
        //     this.setState({isLoading: false});
        // });
    };

    editHandler = roomCategoryID => {
        this.setState({isEditing: true});
    }

    modalConfirmHandler = roomCategoryID => {
        this.setState({isEditing: false});
    }

    modalCancelHandler = () => {
        this.setState({isEditing: false});
    };

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <RoomCategoryList 
                        data={this.state.data} 
                        onDelete={this.deleteHandler}
                        onEdit={this.editHandler}
                    />

                    {this.state.isEditing &&
                        <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" ref={this.titleElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" ref={this.priceElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="date">Date</label>
                                    <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="description">description</label>
                                    <textarea id="description" ref={this.descriptionElRef} rows="4"></textarea>
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