import React, {Component} from 'react';
import {dateFormatter} from "../../components/helpers/dateFormatter";
import {Banner, Loader} from '../../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faPlusCircle, faTimes} from '@fortawesome/free-solid-svg-icons';
import {VersatileModal} from '../../components/modals/VersatileModal';
import authService from '../../components/api-authorization/AuthorizeService';
import {DetailModal} from "../../components/modals/DetailModal";
import Event from "./Event";
import EventForm, {EventData} from "./EventForm";
import {FormModal} from "../../components/modals/FormModal";

/**
 * Renders an event list component in a table.
 */
export default class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            events: [],
            people: [],
            userData: [],
            modal: null
        };

        this.toggle = this.toggle.bind(this);
        this.toggleReload = this.toggleReload.bind(this);
    }

    /**
     * Returns all events
     */
    getEvents() {
        fetch('api/Events')
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    events: result,
                    loading: false,
                });
            });
    }

    /**
     * Returns people for all events
     */
    getPeople() {
        fetch('api/People')
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    people: result,
                });
            });
    }

    componentDidMount() {
        this.populateUserData();
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
            } else {
                this.setState({
                    modal: `detail${modal.id}`
                })
            }
        }
    }

    toggleReload() {
        this.setState({
            modal: null,
            loading: true
        });
        console.log("Modals closed");
        this.populateUserData();
    }

    /**
     * Removes an event from the DB
     *
     * @param {int} id Id of the task to remove
     */
    async removeEvent(id) {
        const token = await authService.getAccessToken();
        fetch(`api/Events/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.ok) {
                    console.log("Event Cancelled!");
                } else {
                    console.error("Could not delete: " + res.status);
                }
            }).catch(error => {
            console.error(error)
        });
        await this.populateUserData();
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
        await this.populateContactData(this.state.userData);
        await this.getPeople();
        await this.getEvents();
    }

    /**
     * Populates the contact data for a section
     * @param {Array} clump UserData in a clump
     */
    async populateContactData(clump) {
        const token = await authService.getAccessToken();
        const sub = clump.sub;
        await fetch(`api/People/PersonalContacts/${sub}`, {
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => response.json())
            .then((result) => {
                this.setState({
                    contacts: result,
                    loading: false
                });
                if (result.length < 1)
                    this.setState({missingData: true,});
            });
    }

    /**
     * Renders an event row with buttons for edits.
     * @param {Array} event The Event Item
     */
    EventItem(event) {
        let widget = <div className="btn-group btn-group-sm">
            <FormModal
                opener={this.state.modal === `form${event.id}`}
                toggler={this.toggle}
                clicker={this.toggle.bind(this, `form`, event)}
                block={false}
                buttonLabel={<FontAwesomeIcon icon={faEdit}/>}
            >
                <EventForm
                    id={event.id}
                    event={event}
                    userData={this.state.userData}
                    onCloseEditModal={this.toggleReload}
                />
            </FormModal>
            <VersatileModal
                buttonClass={"danger"}
                buttonLabel={<FontAwesomeIcon icon={faTimes}/>}
                modalTitle={`Remove Task "${event.name}"`}
                modalText={"Are you sure you want to delete this event? This cannot be undone and participants will NOT be notified."}
                modalConfirmText={"Cancel Event"}
                modalAction={() => this.removeEvent(event.id)}
            />
        </div>;
        return <tr key={event.id}>
            <td>{widget}</td>
            <td>
                <DetailModal
                    opener={this.state.modal === `detail${event.id}`}
                    toggler={this.toggle}
                    clicker={this.toggle.bind(this, `detail`, event)}
                    block={false}
                    buttonLabel={`${event.name}`}
                >
                    <Event
                        userData={this.state.userData}
                        event={event}
                        id={event.id}
                    />
                </DetailModal>
            </td>
            <td>{dateFormatter(event.startTime)}</td>
            <td>{dateFormatter(event.endTime)}</td>
            {event.participants.length === 0 ? <td>None</td> : <td>{event.participants.length} participants</td>}
        </tr>;
    }

    render() {
        let events = this.state.events;
        if (this.state.loading === true) {
            return (<div><Loader/></div>);
        }

        if (events.length === 0) {
            return <>
                <Banner title="Events" subtitle="There are no events."/>
                <FormModal
                    opener={this.state.modal === `form0`}
                    toggler={this.toggle}
                    clicker={this.toggle.bind(this, `form`, new EventData())}
                    block={true}
                    buttonLabel={<FontAwesomeIcon icon={faPlusCircle}/>}
                >
                    <EventForm
                        event={new EventData()}
                        userData={this.state.userData}
                        onCloseEditModal={this.toggleReload}
                    />
                </FormModal>
            </>
        }

        return <section className="container-fluid">
            <Banner title="Events"
                    subtitle={`${events.length} ${events.length > 1 ? "events" : "event"}`}/>

            <table className="table table-responsive-sm table-striped">
                <thead className="thead-dark">
                <tr>
                    <th/>
                    <th>Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Participants</th>
                </tr>
                </thead>
                <tbody>
                {events.map(e => this.EventItem(e))}
                </tbody>
            </table>
            <FormModal
                opener={this.state.modal === `form0`}
                toggler={this.toggle}
                clicker={this.toggle.bind(this, `form`, new EventData())}
                block={true}
                buttonLabel={<FontAwesomeIcon icon={faPlusCircle}/>}
            >
                <EventForm
                    event={new EventData()}
                    userData={this.state.userData}
                    onCloseEditModal={this.toggleReload}
                />
            </FormModal>
        </section>;
    }
}
