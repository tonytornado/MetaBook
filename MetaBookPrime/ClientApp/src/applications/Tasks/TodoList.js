import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '../../components/Layout';
import { dateFormatter } from "../Moments/Event";


export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: []
        };
    }

    componentDidMount() {
        this.getItems();
    }

    render() {
        const items = this.state.items;

        if (items.length === 0) {
            return <div>
                <h3>There are no tasks available.</h3>
                <Link tag={Link} className="btn btn-primary disabled" to="" >Add Task</Link>
            </div>
        }

        return (
            <section className="container-fluid">
                <Banner title="Tasks" subtitle={`${items.length} ${items.length > 1 ? "tasks" : "task"}`} />
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            {/* <th>Completion Date</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => item ? ListItem(item) : "No items found.")}
                    </tbody>
                </table>
            </section>
        )
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

/**
 * Renders a row of the Todo List with an item and all its information.
 * 
 * @param {Array} item A todoList item
 */
function ListItem(item) {
    return (
        <tr key={item.id}>
            <td><Link to={`/tasks/${item.id}`}>{item.title}</Link></td>
            <td>{item.description}</td>
            <td>{item.dueDate ? dateFormatter(item.dueDate) : "None"}</td>
            {/* <td>{item.completedDate ?? dateFormatter(item.completedDate)}</td> */}
        </tr>
    )
}

