import React, { Component } from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import { Banner, Loader } from '../../components/Layout';
import { dateFormatter } from "../../components/helpers/dateFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VersatileModal } from "../../components/modals/VersatileModal";
import TodoForm, { ItemData } from "./TodoForm";
import TodoItem from "./TodoItem";
import { FormModal } from "../../components/modals/FormModal";
import { DetailModal } from "../../components/modals/DetailModal";


export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            userData: [],
            showModal: false,
            editModalState: false,
            detailModalState: false,
            formModalState: false,
            taskModalState: false,
        };

        this.handleDetailModalChange = this.handleDetailModalChange.bind(this);
        this.handleEditModalChange = this.handleEditModalChange.bind(this);
        this.handleFormModalChange = this.handleFormModalChange.bind(this);
        this.handleTaskModalChange = this.handleTaskModalChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.getItems = this.getItems.bind(this);
    }

    componentDidMount() {
        this.populateUserData();
        this.getItems();
    }

    handleDetailModalChange() {
        this.setState({
            detailModalState: !this.state.detailModalState
        });
        this.getItems();
    };

    handleEditModalChange() {
        this.setState({
            editModalState: !this.state.editModalState
        });
        this.getItems();
    };

    handleFormModalChange() {
        this.setState({
            formModalState: !this.state.formModalState
        });
        this.getItems();
    };

    handleTaskModalChange() {
        this.setState({
            taskModalState: !this.state.taskModalState
        });
        this.getItems();
    };

    /**
     * Grabs user data from the server after verifying with token
     */
    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('/connect/userinfo', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
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
                <FormModal showModal={this.handleEditModalChange}
                    modalState={this.state.editModalState}
                    modalTitle={"Edit Task"}
                    buttonLabel={<FontAwesomeIcon icon={faEdit} />}
                    block={false}
                >
                    <TodoForm
                        userData={this.state.userData}
                        item={item}
                        onCloseEditModal={this.handleEditModalChange}
                    />
                </FormModal>
                <FormModal showModal={this.handleTaskModalChange}
                    modalState={this.state.taskModalState}
                    modalTitle={"Edit Task"}
                    buttonLabel={<FontAwesomeIcon icon={faCheck} />}
                    block={false}
                >
                    <TodoItem
                        item={item}
                        userData={this.state.userData}
                        onCloseEditModal={this.handleTaskModalChange}
                    />
                </FormModal>
                {/*<Link className="btn btn-primary" to={`/tasks/edit/${item.id}`} id={`editToggle${item.id}`}><FontAwesomeIcon icon={faEdit} /></Link>*/}
                {/*<Link className="btn btn-success" to={`/tasks/${item.id}`}*/}
                {/*      id={`completeToggle${item.id}`}><FontAwesomeIcon icon={faCheck}/></Link>*/}
            </>
        }

        return (
            <tr key={item.id}>
                <td>
                    <div className="btn-group btn-group-sm">
                        {widget}
                        <VersatileModal
                            buttonClass={"danger"}
                            buttonLabel={<FontAwesomeIcon icon={faTimes} />}
                            modalTitle={`Remove Task "${item.title}"`}
                            modalText={"Are you sure you want to delete this item? This cannot be undone."}
                            modalConfirmText={"Confirm Deletion"}
                            modalAction={() => this.removeItem(item.id)}
                        />
                    </div>
                </td>
                <td>
                    <DetailModal
                        linkLabel={item.title}
                        showModal={this.handleDetailModalChange}
                        modalState={this.state.detailModalState}
                    >
                        <TodoItem
                            item={item}
                            id={item.id}
                            onCloseEditModal={this.handleTaskModalChange}
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
            return <Loader />
        }

        if (items.length === 0) {
            return <div>
                <Banner title="Tasks" subtitle="Uh... where are they?" />
                <p className="text-center">There are no tasks available.</p>
                <FormModal
                    buttonLabel={"Add Item"}
                    modalTitle={"Add Item"}
                    modalState={this.state.formModalState}
                    block={true}
                    showModal={this.handleFormModalChange}>
                    <TodoForm
                        id={0}
                        item={new ItemData()}
                        userData={this.state.userData}
                        onCloseEditModal={this.handleFormModalChange}
                    />
                </FormModal>
            </div>
        }

        return (
            <section className="container-fluid">
                <Banner title="Tasks" subtitle={`${items.length} ${items.length > 1 ? "tasks" : "task"}`} />
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th />
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
                    buttonLabel={"Add Item"}
                    modalTitle={"Add Item"}
                    modalState={this.state.formModalState}
                    block={true}
                    showModal={this.handleFormModalChange}>
                    <TodoForm
                        id={0}
                        item={new ItemData()}
                        userData={this.state.userData}
                        onCloseEditModal={this.handleFormModalChange}
                    />
                </FormModal>
            </section>
        )
    }
}
