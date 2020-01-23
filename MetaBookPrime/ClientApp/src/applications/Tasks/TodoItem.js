import React, { Component } from 'react';

/**
 * Renders a ToDo item
 */
export default class TodoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            item: []
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        
        this.getItem(params.Id);
    }

    render() {
        return this.todoItemRender(this.state.item);
    }

    /**
     * Retrieves the item via url Id
     * 
     * @param {int} id The Item Id
     */
    getItem(id) {
        fetch(`api/Tasks/${id}`)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        item: result,
                        loading: false
                    });
                }
            ).catch(error =>
                console.error(error)
            )
    }

    /**
     * Renders the to do item.
     * 
     * @param {Array} item The todo item.
     */
    todoItemRender(item) {
        return <article>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Created date: {item.createdDate}</p>
            <p>Due Date: {item.dueDate ? item.dueDate : "Not Set"}</p>
        </article>;
    }
}

