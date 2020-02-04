import React, {Component} from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import {Banner, Loader} from '../../components/Layout';
import {dateFormatter} from "../../components/helpers/dateFormatter";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faPlusCircle, faTimes} from '@fortawesome/free-solid-svg-icons';
import {VersatileModal} from "../../components/modals/VersatileModal";
import TodoForm, {ItemData} from "./TodoForm";
import TodoItem from "./TodoItem";
import {FormModal} from "../../components/modals/FormModal";
import {DetailModal} from "../../components/modals/DetailModal";


export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            userData: [],
            modal: null
        };

        this.toggle = this.toggle.bind(this);
        this.toggleReload = this.toggleReload.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.getItems = this.getItems.bind(this);
    }

    componentDidMount() {
        this.populateUserData();
        this.getItems();
    }

    /**
     * Toggles the modals in this list
     *
     * @param {String} set      Form/Detail
     * @param {Number} modal    Modal Id
     */
    toggle(set, modal) {
        console.log(modal);
        if (this.state.modal) {
            this.setState({
                modal: null
            });
        } else {
            if (set === 'form') {
                this.setState({
                    modal: `form${modal.id}`
                })
            } else if (set === 'completion') {
                this.setState({
                    modal: `completion${modal.id}`
                })
            } else {
                this.setState({
                    modal: `detail${modal.id}`
                })
            }
        }
    }

    toggleReload() {
        this.setState({
            modal: null
        });
        this.populateUserData();
        this.getItems();
    }

    /**
     * Grabs user data from the server after verifying with token
     */
    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('/connect/userinfo', {
            headers: !token ? {} : {'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({
            userData: data
        });
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
                    console.log("Task Deleted!");
                } else {
                    console.error("Could not delete: " + res.status);
                }
            }).catch(error => {
            console.error(error)
        });
        this.getItems();
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

    /**
     * Renders an item object in the row.
     *
     * @param {Array} item Item array
     */
    ListItem(item) {
        let widget;

        if (!item.completed) {
            widget = <>
                <FormModal
                    opener={this.state.modal === `form${item.id}`}
                    toggler={this.toggle}
                    clicker={this.toggle.bind(this, `form`, item)}
                    block={false}
                    buttonLabel={<FontAwesomeIcon icon={faEdit}/>}
                >
                    <TodoForm
                        userData={this.state.userData}
                        item={item}
                        onCloseEditModal={this.toggleReload}
                    />
                </FormModal>
                <FormModal
                    opener={this.state.modal === `completion${item.id}`}
                    toggler={this.toggle}
                    clicker={this.toggle.bind(this, `completion`, item)}
                    block={false}
                    buttonLabel={<FontAwesomeIcon icon={faCheck}/>}
                >
                    <TodoItem
                        item={item}
                        userData={this.state.userData}
                        onCloseEditModal={this.toggleReload}
                    />
                </FormModal>
            </>
        }

        return (
            <tr key={item.id}>
                <td>
                    <div className="btn-group btn-group-sm">
                        {widget}
                        <VersatileModal
                            buttonClass={"danger"}
                            buttonLabel={<FontAwesomeIcon icon={faTimes}/>}
                            modalTitle={`Remove Task "${item.title}"`}
                            modalText={"Are you sure you want to delete this item? This cannot be undone."}
                            modalConfirmText={"Confirm Deletion"}
                            modalAction={() => this.removeItem(item.id)}
                        />
                    </div>
                </td>
                <td>
                    <DetailModal
                        opener={this.state.modal === `detail${item.id}`}
                        toggler={this.toggle}
                        clicker={this.toggle.bind(this, `detail`, item)}
                        block={false}
                        buttonLabel={`${item.title}`}
                    >
                        <TodoItem
                            id={item.id}
                            item={item}
                            onCloseEditModal={this.toggleReload}
                        />
                    </DetailModal>
                </td>
                <td>{item.description}</td>
                <td>{item.dueDate ? dateFormatter(item.dueDate) : "None"}</td>
            </tr>
        );
    }

    render() {
        const items = this.state.items;

        if (this.state.loading === true) {
            return <Loader/>
        }

        if (items.length === 0) {
            return <div>
                <Banner title="Tasks" subtitle="Uh... where are they?"/>
                <p className="text-center">There are no tasks available.</p>
                <FormModal
                    opener={this.state.modal === `form0`}
                    toggler={this.toggle}
                    clicker={this.toggle.bind(this, `form`, new ItemData())}
                    block={true}
                    buttonLabel={<FontAwesomeIcon icon={faPlusCircle}/>}
                >
                    <TodoForm
                        id={0}
                        item={new ItemData()}
                        userData={this.state.userData}
                        onCloseEditModal={this.toggleReload}
                    />
                </FormModal>
            </div>
        }

        return (
            <section className="container-fluid">
                <Banner title="Tasks" subtitle={`${items.length} ${items.length > 1 ? "tasks" : "task"}`}/>
                <table className="table table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th/>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => item
                        ? this.ListItem(item)
                        : "No items found.")}
                    </tbody>
                </table>
                <FormModal
                    opener={this.state.modal === `form0`}
                    toggler={this.toggle}
                    clicker={this.toggle.bind(this, `form`, new ItemData())}
                    block={true}
                    buttonLabel={<FontAwesomeIcon icon={faPlusCircle}/>}
                >
                    <TodoForm
                        id={0}
                        item={new ItemData()}
                        userData={this.state.userData}
                        onCloseEditModal={this.toggleReload}
                    />
                </FormModal>
            </section>
        )
    }
}
