import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {dateFormatter} from "../../components/helpers/dateFormatter";
import {Banner, Loader} from '../../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import {VersatileModal} from '../../components/modals/VersatileModal';
import authService from '../../components/api-authorization/AuthorizeService';
import {DetailModal} from "../../components/modals/DetailModal";
import Event from "./Event";
import EventForm from "./EventForm";
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
            editModalState: false,
            detailModalState: false,
            formModalState: false
        };

        this.handleDetailModalChange = this.handleDetailModalChange.bind(this);
        this.handleEditModalChange = this.handleEditModalChange.bind(this);
        this.handleFormModalChange = this.handleFormModalChange.bind(this);
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
                });
            });
    }

    /**
     * Returns people for all events
     */
    getPeople() {
        fetch('api/People/')
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    people: result,
                    loading: false,
                });
            });
    }

    componentDidMount() {
        this.getPeople();
        this.getEvents();
    }

    handleDetailModalChange() {
        this.setState({
            detailModalState: !this.state.detailModalState
        })
    };

    handleEditModalChange() {
        this.setState({
            editModalState: !this.state.editModalState
        })
    };

    handleFormModalChange() {
        this.setState({
            formModalState: !this.state.formModalState
        })
    };

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
    }

    /**
     * Renders an event row with buttons for edits.
     * @param {Array} event The Event Item
     */
    EventItem(event) {
        let eventModal = this.state.detailModalState;
        let widget = <div className="btn-group btn-group-sm">
            {/*<Link className="btn btn-primary" to={`/events/edit/${event.id}`} id={`editToggle${event.id}`}><FontAwesomeIcon icon={faEdit}/></Link>*/}
            <FormModal
                buttonLabel={<FontAwesomeIcon icon={faEdit}/>}
                modalTitle={"Edit Event"}
                modalState={this.state.editModalState}
                showModal={this.handleEditModalChange}
                block={false}>
                <EventForm
                    id={event.id}
                    event={event}
                    userData={this.state.userData}
                    onCloseEditModal={this.handleEditModalChange}
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
            {/*<td><Link to={`/events/${event.id}`}>{event.name}</Link></td>*/}
            <td>
                <DetailModal
                    linkLabel={event.name}
                    showModal={this.handleDetailModalChange}
                    modalState={eventModal}
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
                <Link to="/events/add/" className="btn btn-primary btn-block">Add Event</Link>
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
            {/*<Link to="/events/add/" className="btn btn-primary btn-block">Add Event</Link>*/}
            <FormModal
                buttonLabel={"Add Event"}
                modalTitle={"Add Event"}
                modalState={this.state.formModalState}
                block={true}
                showModal={this.handleFormModalChange}>
                <EventForm
                    id={0}
                    userData={this.state.userData}
                    onCloseEditModal={this.handleFormModalChange}
                />
            </FormModal>
        </section>;
    }
}
