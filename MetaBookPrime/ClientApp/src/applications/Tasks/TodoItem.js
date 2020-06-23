import React, { Component } from 'react';
import { dateFormatter } from "../../components/helpers/dateFormatter";
import authService from '../../components/api-authorization/AuthorizeService';

/**
 * Renders a Task item
 */
export default class TodoItem extends Component {
    static displayName = TodoItem.name;

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            userData: this.props.userData
        };
        this.markComplete = this.markComplete.bind(this);
    }

    componentDidMount() {
    }

    /**
     * Marks a task completed
     *
     * @param {Int} id The id of the task item
     * @param {Boolean} status True/False for completion
     */
    async markComplete(id, status) {
        const token = await authService.getAccessToken();
        fetch(`api/Tasks/Completed/${id}/${status}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.ok) {
                    console.log("Change completed!");
                    this.getItem(id);
                } else {
                    console.error("Could not mark complete: " + res.status);
                }
            }).catch(error => {
                console.error(error)
            });

        this.props.onCloseEditModal();
    }

    getItem(id) {
        fetch(`api/Tasks/${id}`)
            .then(response => {
                return response.json();
            })
            .then((result) => {
                this.setState({
                    item: result,
                    loading: false,
                });
            }).catch(error => {
                console.error(error)
            });
    }

    render() {
        let thing = this.state.item;
        let taskText = thing.timeToComplete ? <tr><td><b>Active Time</b></td><td>{thing.timeToComplete}</td></tr> : null;

        return (
            <>
                <div className="border rounded p-3 my-3 shadow-sm" key={thing.id}>
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <td colSpan="2">
                                    <h3 className="text-center">{thing.title}</h3>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Description</b></td>
                                <td>{thing.description}</td>
                            </tr>
                            <tr>
                                <td><b>Created</b></td>
                                <td>{dateFormatter(thing.createdDate)}</td>
                            </tr>
                            <tr>
                                <td><b>Due</b></td>
                                <td>{thing.dueDate ? dateFormatter(thing.dueDate) : "Not Set"}</td>
                            </tr>
                            {taskText}
                        </tbody>
                    </table>
                </div>
                <div>
                    {this.completeButton(thing.completed, thing.id)}
                </div>
            </>
        );
    }

    /**
     * Marks a task as completed or incomplete.
     *
     * @param {Boolean} complete
     * @param {Int}    id
     * @returns {*}
     */
    completeButton(complete, id) {
        if (complete === false) {
            return <button onClick={() => this.markComplete(id, true)} type="button"
                className="btn btn-block btn-primary">Mark Completed</button>
        } else {
            return <button onClick={() => this.markComplete(id, false)} type="button"
                className="btn btn-block btn-primary">Mark Incompleted</button>
        }
    }
}

