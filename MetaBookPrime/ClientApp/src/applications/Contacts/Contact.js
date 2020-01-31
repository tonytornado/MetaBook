import React, { Component } from 'react';
import { Banner, Loader } from '../../components/Layout';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGlobe, faPhone, faHome, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { VersatileModal } from '../../components/modals/VersatileModal';
import authService from '../../components/api-authorization/AuthorizeService';
import { dateFormatter } from "../../components/helpers/dateFormatter";


/**
 * Renders a contacts table
 * */
export default class Contact extends Component {
    static displayName = Contact.name;

    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            contact: [],
            personalEvents: [],
            loading: true,
            missingData: false
        };
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        this.populateUserData();
        this.getPersonalEvents(params.id);
        this.getPersonalDetails(params);
        
    }

    async removeThisPerson(id) {
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
                    console.log("Contact Deleted!");
                    this.props.history.push('/contacts/');
                } else {
                    console.error("Could not delete: " + res.status);
                }
            }).catch(error => {
                console.error(error)
            });
    }

    /**
     * Retrieves all personal data relevant to the contact
     * @param {Array} params Parameter array from route
     */
    getPersonalDetails(params) {
        fetch(`api/People/Details/${params.id}`)
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    contact: result,
                    loading: false,
                });
                if (result.length < 1)
                    this.setState({ missingData: true, });
            });
    }

    /**
     * Retrieves all personal events related to contact
     * @param {number} id
     */
    getPersonalEvents(id) {
        fetch(`api/Events/Itinerary/${id}`)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        personalEvents: result
                    });
                }
            )
    }

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
     * Renders the table for the contact information
     * @param {array} contact
     * @param {array} events
     */
    renderContactInfo(contact, events) {
        let ButtonText;

        if (this.state.userData.sub !== contact.ownerId) {
            ButtonText = "";
        } else {
            ButtonText = <div className="btn-group btn-block">
                <Link to={`edit/${contact.id}`} className="btn btn-primary">Edit Contact</Link>
                <VersatileModal buttonLabel={"Delete"} buttonClass={"danger"} modalTitle={`Delete ${contact.firstName}?`} modalText={"Are you sure you want to remove this contact? It cannot be undone"} modalConfirmText={"Confirm Delete"} modalAction={() => Contact.removeThisPerson(contact.id)} />
            </div>;
        }

        return <section>
            <div className="card p-3" id="contact-card">
                {/* <div className="card-header">
                        <h4 className="card-title"><FontAwesomeIcon
                            icon={faUser} /> {contact.firstName} {contact.lastName}</h4>
                    </div> */}
                <div className="card-body">
                    <p className="card-title"><FontAwesomeIcon
                        icon={faEnvelope} /> {contact.email ? contact.email : "No E-Mail Available"}</p>
                    <p className="card-title"><FontAwesomeIcon
                        icon={faGlobe} /> {contact.website ? contact.website : "No Website"} </p>
                </div>
                <PhoneData phones={contact.phones} />
                <AddressData addresses={contact.addresses} />
                <PersonalEvents eventData={events} />
            </div>
            <br />
            {ButtonText}
        </section>;
    }

    render() {
        let contents;
        let contact = this.state.contact;

        contents = this.state.loading
            ? <div><Loader /></div>
            : this.renderContactInfo(contact, this.state.personalEvents);

        return (
            <div>
                <Banner title={contact.firstName} subtitle={contact.lastName} />
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
                    <th colSpan="2"><FontAwesomeIcon icon={faPhone} /> Phones</th>
                </tr>
            </thead>
            <tbody>
                {phones.map(phone =>
                    <tr key={phone.phoneId}>
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
                        <th colSpan="2"><FontAwesomeIcon icon={faHome} /> Addresses</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map(address =>
                        <tr key={address.addressId}>
                            <td width="20%"><h6>{address.addressType}</h6></td>
                            <td>{address.streetName}<br />{address.cityName}, {address.stateName} {address.postalCode}</td>
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
            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th colSpan="2"><FontAwesomeIcon icon={faCalendarDay} /> Events</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(e =>
                        <tr key={e.id}>
                            <td width="20%">{dateFormatter(e.startTime)}</td>
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