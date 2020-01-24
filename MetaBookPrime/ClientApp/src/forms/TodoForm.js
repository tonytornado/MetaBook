import React, { Component } from 'react';
import authService from '../components/api-authorization/AuthorizeService';
import { Banner, Loader } from '../components/Layout';

/**
 * Form for todo lists
 * */
export default class TodoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: new ItemData(),
            userData: [],
            loading: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        const data = new FormData(e.target);
        const token = await authService.getAccessToken();
        let col = this.state.item.id;

        if (col !== 0) {
            await fetch(`api/Tasks/${col}`,
                {
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'user_id': this.state.userData.sub
                    },
                }).then((res) => {
                    if (res.ok) {
                        console.log("Updated!");
                        this.props.history.push('/tasks');
                    } else
                        console.error("Post error: " + res.status);
                }).catch(e => {
                    console.log("error: " + e);
                });
        } else if (col === 0) {
            await fetch('api/Tasks',
                {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'user_id': this.state.userData.sub
                    },
                }).then((res) => {
                    if (res.ok) {
                        console.log("Perfect!");
                        console.log(res.json());
                        this.props.history.push('/tasks');
                    } else
                        console.error("Post error: " + res.status);
                }).catch(e => {
                    console.log("error: " + e);
                });
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        var task_id = params.id;

        // Get user data
        this.populateUserData();

        // Check for editable data
        this.checkForItemData(task_id);
    }

    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('connect/userinfo', {
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        this.setState({ userData: data, loading: false });
    }

    /**
     * Checks for any editable task data
     * 
     * @param {int} id  The id of the editable task
     */
    checkForItemData(id) {
        if (id > 0) {
            fetch(`api/Tasks/${id}`)
                .then(response => response.json())
                .then(data => {
                    setTimeout(function () {
                        this.setState({ item: data })
                    }.bind(this), 1000)
                });
        }
    }

    render() {
        if (this.state.loading === true) {
            return <Loader />;
        } else {
            return (
                <div>
                    <Banner title="Add Task" subtitle="What do you want to do?" />
                    <form onSubmit={this.handleSubmit} className="border rounded p-3 shadow-sm">
                        <input type="hidden" name="id" defaultValue={this.state.item.id} />
                        <div>
                            <div className="form-group">
                                <input type="text" placeholder="Add Task" name="title" className="form-control" />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Description" name="description" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input type="date" className="form-control" name="dueDate" />
                        </div>
                        <input type="submit" className="btn btn-primary btn-block" name="task-act" value="Add Task" />
                    </form>
                </div>
            );
        }
    }
}


class ItemData {
    id = 0;
    title = "";
    description = "";
    dueDate = null;
    createdDate = Date.now;
    completed = false;
    completedDate = null;
}
