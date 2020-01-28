import { faLocationArrow, faUserAlt, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import { Banner, Loader } from '../../components/Layout';

/**
 * Formats the date returned.
 * 
 * @param {datetime} date The formatted date.
 */
export function dateFormatter(date) {
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
 * Renders an event component
 */
export default class Event extends Component {
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
                    <article className="row">
                        <div className="col-sm">
                            <ul className="list-group list-group-vertical">
                                <li className="list-group-item"><FontAwesomeIcon icon={faUserClock} /> {dateFormatter(event.startTime)} <br /> <FontAwesomeIcon icon={faUserClock} />{dateFormatter(event.endTime)} </li>
                                <li className="list-group-item"><FontAwesomeIcon icon={faLocationArrow} /> {event.location}</li>
                            </ul>
                            <div className="jumbotron">
                                <p className="lead">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                        <div className="col-sm">
                            <Participants people={event.participants} />
                        </div>
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