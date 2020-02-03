import { faLocationArrow, faUserAlt, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link } from 'react-router-dom';
import { Banner, Loader } from '../../components/Layout';
import { dateFormatter } from '../../components/helpers/dateFormatter';

/**
 * Renders an event component
 */
export default class Event extends Component {
    static displayName = Event.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            event: this.props.event,
            people: []
        };
    }

    componentDidMount() {
        this.populateUserData();
        this.getEventDetails(this.props.id);
    }

    getEventDetails(id) {
        fetch(`api/Events/${id}`)
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    event: result,
                    loading: false,
                });
            });
    }

    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('connect/userinfo', {
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        this.setState({ userData: data });
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
                                <li className="list-group-item"><FontAwesomeIcon
                                    icon={faUserClock} /> {dateFormatter(event.startTime)} <br /> <FontAwesomeIcon
                                        icon={faUserClock} />{dateFormatter(event.endTime)} </li>
                                <li className="list-group-item"><FontAwesomeIcon
                                    icon={faLocationArrow} /> {event.location}</li>
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
                <tr>
                    <th>Participants</th>
                </tr>
            </thead>
            <tbody>
                {invitees.map(i =>
                    <tr key={i.id}>
                        <td>
                            {i.photo ? <img src={i.photo} alt={i.name} /> :
                                <FontAwesomeIcon icon={faUserAlt} size="1x" />}
                            <Link to={`/contacts/${i.id}`}> {i.firstName} {i.lastName} ({i.email})</Link>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
}