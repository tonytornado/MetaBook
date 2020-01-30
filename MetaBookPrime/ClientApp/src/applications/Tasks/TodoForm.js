import React, {Component} from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import {Banner, Loader} from '../../components/Layout';

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
        e.preventDefault();
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
        // Get user data
        this.populateUserData();
        
        const {match: {params}} = this.props;
        const task_id = params.id;
        
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
        this.setState({userData: data, loading: false});
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
                        this.setState({item: data})
                    }.bind(this), 1000)
                });
        }
    }

    render() {
        const mainFormData = this.state.item;
        
        if (this.state.loading === true) {
            return <Loader/>;
        } else {
            return (
                <div>
                    <Banner title="Task!" subtitle="What do you want to do?"/>
                    <form onSubmit={this.handleSubmit} className="border rounded p-3 shadow-sm">
                        <input type="hidden" name="id" defaultValue={this.state.item.id} />
                        <input type="hidden" name="ownerId" defaultValue={this.state.userData.sub} />
                        <div>
                            <div className="form-group">
                                <input type="text" placeholder="Add Task" name="title" className="form-control" defaultValue={mainFormData.title}/>
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Description" name="description" className="form-control" defaultValue={mainFormData.description}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input type="date" className="form-control" name="dueDate" defaultValue={mainFormData.dueDate}/>
                        </div>
                        <input type="submit" className="btn btn-primary btn-block" name="task-act" value="Add Task"/>
                    </form>
                </div>
            );
        }
    }
}

/**
 * Item class
 */
class ItemData {
    id = 0;
    title = "";
    description = "";
    dueDate = null;
    createdDate = Date.now;
    completed = false;
    completedDate = null;
}
