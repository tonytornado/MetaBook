import React, {Component} from 'react';
import {Banner, Loader} from '../../components/Layout';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope, faUser, faGlobe, faPhone, faHome, faCalendarDay} from '@fortawesome/free-solid-svg-icons';


/**
 * Renders a contacts table
 * */
export default class Contact extends Component {
    static displayName = Contact.name;

    constructor(props) {
        super(props);
        this.state = {
            contact: [],
            personalEvents: [],
            loading: true,
            missingData: false
        };
    }

    componentDidMount() {
        const {match: {params}} = this.props;

        this.getPersonalDetails(params);
        this.getPersonalEvents(params.id);
    }

    getPersonalDetails(params) {
        fetch(`api/People/Details/${params.id}`)
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    contact: result,
                    loading: false
                });
                if (result.length < 1)
                    this.setState({missingData: true,});
            });
    }

    /**
     * Gets all personal events related to them
     * @param {number} id
     */
    getPersonalEvents(id) {
        fetch(`api/Events/Itinerary/${id}`)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        personalEvents: result,
                        loading: false,
                    });
                }
            )
    }

    /**
     * Renders the table for the contact information
     * @param {array} contacts
     * @param {array} events
     */
    static renderContactInfo(contacts, events) {
        return (
            <section>
                <div className="card" id="contact-card">
                    <div className="card-header">
                        <h4 className="card-title"><FontAwesomeIcon
                            icon={faUser}/> {contacts.firstName} {contacts.lastName}</h4>
                    </div>
                    <div className="card-body">
                        <p className="card-title"><FontAwesomeIcon
                            icon={faEnvelope}/> {contacts.email ? contacts.email : "No data"}</p>
                        <p className="card-title"><FontAwesomeIcon
                            icon={faGlobe}/> {contacts.website ? contacts.website : "No data"} </p>
                    </div>
                    <PhoneData phones={contacts.phones}/>
                    <AddressData addresses={contacts.addresses}/>
                    <PersonalEvents eventData={events}/>
                </div>
                <br/>
                <Link to={`edit/${contacts.id}`} className="btn btn-primary">Edit Contact</Link>
            </section>
        );
    }

    render() {
        let contents;

        contents = this.state.loading ?
            <Loader/> : Contact.renderContactInfo(this.state.contact, this.state.personalEvents);

        return (
            <div>
                <Banner title="Contact Information" subtitle=""/>
                {contents}

            </div>
        );
    }
}


/**
 * Renders phone data.
 *
 * @param {any} props
 * @return {null}
 */
function PhoneData(props) {
    const phones = props.phones;

    return phones != null && phones.length > 0 ? (
        <table className="table table-bordered">
            <thead className="thead-dark">
            <tr>
                <th colSpan="2"><FontAwesomeIcon icon={faPhone}/> Phones</th>
            </tr>
            </thead>
            <tbody>
            {phones.map(phone =>
                <tr key={phone.id}>
                    <td width="20%"><h6>{phone.callerType}</h6></td>
                    <td>{phone.formattedNumber}</td>
                </tr>
            )}
            </tbody>
        </table>
    ) : null;
}

/**
 * Renders address data.
 * @param {any} props
 * @return {null}
 */
function AddressData(props) {
    const addresses = props.addresses;

    if (addresses != null && addresses.length > 0) {
        return (
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th colSpan="2"><FontAwesomeIcon icon={faHome}/> Addresses</th>
                </tr>
                </thead>
                <tbody>
                {addresses.map(address =>
                    <tr key={address.id}>
                        <td width="20%"><h6>{address.addressType}</h6></td>
                        <td>{address.streetName}<br/>{address.cityName}, {address.stateName} {address.postalCode}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    } else {
        return null;
    }

}

/**
 * Adds personal events
 * @param {any} props
 * @return {null}
 */
function PersonalEvents(props) {
    const events = props.eventData;

    if (events && events.length > 0) {
        return (
            <table className="table table-responsive-sm">
                <thead className="thead-dark">
                <tr>
                    <th colSpan="1"><FontAwesomeIcon icon={faCalendarDay}/> Events</th>
                </tr>
                </thead>
                <tbody>
                {events.map(e =>
                    <tr key={e.id}>
                        <td><Link to={`/events/${e.id}`}>{e.name}</Link></td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    } else {
        return null;
    }
}