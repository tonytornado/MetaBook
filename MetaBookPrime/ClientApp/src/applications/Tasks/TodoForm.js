import React, {Component} from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import {Banner} from '../../components/Layout';

/**
 * Form for todo lists
 * */
export default class TodoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            userData: this.props.userData,
            // loading: true
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
                } else
                    console.error("Post error: " + res.status);
            }).catch(e => {
                console.log("error: " + e);
            });
        }

        this.props.onCloseEditModal();
    }

    componentDidMount() {

    }

    render() {
        const mainFormData = this.state.item;

        return (
            <div>
                <Banner title="Task!" subtitle="What do you want to do?"/>
                <form onSubmit={this.handleSubmit} className="border rounded p-3 shadow-sm">
                    <input type="hidden" name="id" defaultValue={this.state.item.id}/>
                    <input type="hidden" name="ownerId" defaultValue={this.state.userData.sub}/>
                    <div>
                        <div className="form-group">
                            <input type="text" placeholder="Add Task" name="title" className="form-control"
                                   defaultValue={mainFormData.title}/>
                        </div>
                        <div className="form-group">
                            <textarea placeholder="Description" name="description" className="form-control"
                                      defaultValue={mainFormData.description}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input type="date" className="form-control" name="dueDate" defaultValue={mainFormData.dueDate} />
                    </div>
                    <input type="submit" className="btn btn-primary btn-block" name="task-act" value="Add Task"/>
                </form>
            </div>
        );
    }
}

/**
 * Item class
 */
export class ItemData {
    id = 0;
    title = "";
    description = "";
    dueDate = null;
    createdDate = Date.now;
    completed = false;
    completedDate = null;
}
