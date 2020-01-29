import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {dateFormatter} from './Event';
import {Banner, Loader} from '../../components/Layout';

/**
 * Renders an event list component in a table.
 */
export default class EventList extends Component {
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
        this.getEvents();
        this.getPeople();
    }

    render() {
        if (this.state.loading === true) {
            return (<div><Loader/></div>);
        } else {
            let events = this.state.events;
            return (<section className="container-fluid">
                <Banner title="Events"
                        subtitle={`${this.state.events.length} ${this.state.events.length > 1 ? "events" : "event"}`}/>

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
                    {events.map(e => <tr key={e.id}>
                        <td><Link to={`/events/${e.id}`}>{e.name}</Link></td>
                        <td>{dateFormatter(e.startTime)}</td>
                        <td>{dateFormatter(e.endTime)}</td>
                        {e.participants.length === 0 ? <td>None</td> : <td>{e.participants.length} participants</td>}
                    </tr>)}
                    </tbody>
                </table>
                <Link to="/events/add/" className="btn btn-primary btn-block">Add Event</Link>
            </section>);
        }
    }
}
