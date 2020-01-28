import React, { Component } from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import { Link } from 'react-router-dom';
import { Banner, Loader } from '../../components/Layout';
import { dateFormatter } from "../Moments/Event";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';


export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            deleteSetting: false
        };

        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount() {
        this.getItems();
    }

    render() {
        const items = this.state.items;

        if (this.state.loading === true) {
            return <Loader />
        }

        if (items.length === 0) {
            return <div>
                <Banner title="Tasks" subtitle="Uh... where are they?" />
                <p className="text-center">There are no tasks available.</p>
                <Link to="tasks/add/" className="btn btn-sm btn-primary btn-block">Add Task</Link>
            </div>
        }

        return (
            <section className="container-fluid">
                <Banner title="Tasks" subtitle={`${items.length} ${items.length > 1 ? "tasks" : "task"}`} />
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            {/* <th>Completion Date</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => item
                            ? this.ListItem(item)
                            : "No items found.")}
                    </tbody>
                </table>
                <Link to="/tasks/add/" className="btn btn-primary btn-block">Add Task</Link>
            </section>
        )
    }

    /**
     * Renders an item object in the row.
     * 
     * @param {Array} item Item array
     */
    ListItem(item) {
        let widget;

        if (!item.completed) {
            widget = <>
                <Link className="btn btn-primary" to={`/tasks/edit/${item.id}`} id={`editToggle${item.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                <Link className="btn btn-success" to={`/tasks/${item.id}`} id={`completeToggle${item.id}`}><FontAwesomeIcon icon={faCheck} /></Link>
            </>
        }

        return (
            <tr key={item.id}>
                <td>
                    <div className="btn-group btn-group-sm">
                        {widget}
                        <button className="btn btn-danger" type="button" onClick={() => this.removeItem(item.id)} id={`removeToggle${item.id}`} title="This will delete this task.">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </td>
                <td><Link to={`/tasks/${item.id}`}>{item.title}</Link></td>
                <td>{item.description}</td>
                <td>{item.dueDate ? dateFormatter(item.dueDate) : "None"}</td>
            </tr>
        );
    }

    /**
     * Removes an item from the DB
     * 
     * @param {int} id Id of the task to remove
     */
    async removeItem(id) {
        const token = await authService.getAccessToken();
        fetch(`api/Tasks/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.ok) {
                    this.setState({
                        loading: true,
                    });
                    console.log("Task Deleted!");
                    this.getItems();
                } else {
                    console.error("Could not delete: " + res.status);
                }
            }).catch(error => {
                console.error(error)
            });
    }

    /**
     * Retrieves all items from the server
     */
    getItems() {
        fetch(`api/Tasks`)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        items: result,
                        loading: false
                    });
                }
            ).catch(error =>
                console.error(error)
            )
    }
}