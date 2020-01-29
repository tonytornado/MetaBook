import React, {Component} from 'react';
import {dateFormatter} from '../Moments/Event';
import {Loader} from '../../components/Layout';
import authService from '../../components/api-authorization/AuthorizeService';

/**
 * Renders a Task item
 */
export default class TodoItem extends Component {
    static displayName = TodoItem.name;

    constructor(props) {
        super(props);
        this.state = {
            item: [],
            userData: [],
            loading: true
        };
        this.markComplete = this.markComplete.bind(this);
    }

    componentDidMount() {
        const {match: {params}} = this.props;

        this.populateUserData();
        this.getItem(params.id);
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
                    this.setState({
                        loading: true,
                    });
                    console.log("Change completed!");
                    this.getItem(id);
                } else {
                    console.error("Could not mark complete: " + res.status);
                }
            }).catch(error => {
            console.error(error)
        });
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

        if (this.state.loading === true) {
            return <Loader/>;
        }

        return (
            <div className="border rounded p-3 shadow-sm text-center" key={thing.id}>
                <div className="">
                    <h3 className="border rounded p-1">{thing.title}</h3>
                    <p>{thing.description}</p>
                    <p>Created date: {dateFormatter(thing.createdDate)}</p>
                    <p>Due Date: {thing.dueDate ? dateFormatter(thing.dueDate) : "Not Set"}</p>
                </div>
                <div>
                    {this.completeButton(thing.completed, thing.id)}
                </div>
            </div>
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
            return <button onClick={() => this.markComplete(id, true)} type="button"
                           className="btn btn-block btn-primary">Mark Incompleted</button>
        }
    }

    populateUserData = async () => {
        const token = await authService.getAccessToken();
        const response = await fetch('connect/userinfo', {
            headers: !token ? {} : {'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({userData: data});
    };
}

