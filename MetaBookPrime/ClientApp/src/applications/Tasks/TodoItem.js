import React, { Component } from 'react';
import { Banner, Loader } from '../../components/Layout';
import { dateFormatter } from '../Moments/Event';

/**
 * Renders a ToDo item
 */
export default class TodoItem extends Component {
    static displayName = TodoItem.name;

    constructor(props) {
        super(props);
        this.state = {
            item: [],
            loading: true
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        this.getItem(params.id);
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

        return (
            <div key={thing.id}>
                <h3>{thing.title}</h3>
                <p>{thing.description}</p>
                <p>Created date: {dateFormatter(thing.createdDate)}</p>
                <p>Due Date: {thing.dueDate ? dateFormatter(thing.dueDate) : "Not Set"}</p>

                {/* <p>Complete?</p> */}
            </div>
        );
    }




}

