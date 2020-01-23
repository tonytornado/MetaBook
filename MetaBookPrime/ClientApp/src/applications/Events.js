import { faClipboardList, faClock, faLocationArrow, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import { Banner, Loader } from '../components/Layout';

function dateFormatter(date) {
    var event = new Date(date);
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };

    return event.toLocaleDateString('en-US', options);
}

/**
 * Renders an event list component in a table.
 */
export class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            events: [],
            people: []
        };
    }

    /**
     * Returns all events
     */
    getEvents() {
        fetch('api/Events')
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        events: result,
                        loading: false,
                    })
                }
            );
    }

    /**
     * Returns people for all events
     */
    getPeople() {
        fetch('api/People/')
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        people: result,
                        loading: false,
                    })
                }
            );
    }

    componentDidMount() {
        this.getEvents();
        this.getPeople();
    }

    render() {
        if (this.state.loading === true) {
            return (<div><Loader /></div>);
        } else {
            let events = this.state.events;

            return (
                <section className="container-fluid">
                    <Banner title="Events" subtitle={`${this.state.events.length} ${this.state.events.length > 1 ? "events" : "event"}`} />
                    {/* <Calendar /> */}
                    <table className="table table-responsive-sm table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(e =>
                                <tr key={e.id}>
                                    <td><Link to={`/events/${e.id}`}>{e.name}</Link></td>
                                    <td>{dateFormatter(e.startTime)}</td>
                                    <td>{dateFormatter(e.endTime)}</td>
                                    {e.participants.length === 0 ? <td>None</td> : <td>{e.participants.length} participants</td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Link to="/event_add" className="btn btn-primary">Add Event</Link>
                </section>
            );
        }
    }
}

/**
 * Renders an event component
 */
export class Event extends Component {
    static displayName = Event.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            event: [],
            people: []
        };
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        fetch(`api/Events/${params.id}`)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        event: result,
                        loading: false,
                    })
                }
            );
    }

    /**
     * Render the component
     */
    render() {
        let event = this.state.event;

        if (this.state.loading === true) {
            return <Loader />;
        } else {
            return (
                <div>
                    <Banner title={event.name} subtitle={event.location} />
                    <article>
                        <ul className="list-group list-group-vertical">
                            <li className="list-group-item"><FontAwesomeIcon icon={faClock} /> {dateFormatter(event.startTime)} - {dateFormatter(event.endTime)} </li>
                            <li className="list-group-item"><FontAwesomeIcon icon={faLocationArrow} /> {event.location}</li>
                        </ul>
                        <div className="jumbotron">
                            <FontAwesomeIcon icon={faClipboardList} />
                            <p className="lead">
                                {event.description}
                            </p>
                        </div>
                        <Participants people={event.participants} />
                    </article>
                </div>
            );
        }
    }
}

/**
 * Returns a list of people invited to an event.
 * @param {Array} props An array of people invited to an event
 */
function Participants(props) {
    let invitees = props.people;

    return (invitees === undefined || invitees.length < 1)
        ? <h3 className="text-center alert alert-warning">Nobody's at it. <br /> Maybe invite some people?</h3>
        :
        <table className="table table-striped rounded">
            <thead className="thead-dark">
                <tr><th>Participants</th></tr>
            </thead>
            <tbody>
                {invitees.map(i =>
                    <tr key={i.id}>
                        <td>
                        {i.photo ? <img src={i.photo} alt={i.name} /> : <FontAwesomeIcon icon={faUserAlt} size="1x" />}
                            <Link to={`/contact/${i.id}`}> {i.name} ({i.email})</Link>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        }