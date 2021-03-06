﻿import React, {Component} from 'react';
import {Banner, Loader} from '../../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendarDay, faEnvelope, faGlobe, faHome, faPhone} from '@fortawesome/free-solid-svg-icons';
import {VersatileModal} from '../../components/modals/VersatileModal';
import {dateFormatter} from "../../components/helpers/dateFormatter";


/**
 * Renders a contacts table
 * */
export default class Contact extends Component {
    static displayName = Contact.name;

    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.userData,
            contact: this.props.contact,
            personalEvents: [],
            loading: true,
            missingData: false
        };
    }

    componentDidMount() {
        this.getPersonalEvents(this.props.id);
        this.getPersonalDetails(this.props.id);
    }

    /**
     * Retrieves all personal data relevant to the contact
     * @param {int} id from route
     */
    getPersonalDetails(id) {
        fetch(`api/People/Details/${id}`)
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    contact: result,
                    loading: false,
                });
                if (result.length < 1)
                    this.setState({missingData: true,});
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
                <VersatileModal buttonLabel={"Delete"} buttonClass={"danger"}
                                modalTitle={`Delete ${contact.firstName}?`}
                                modalText={"Are you sure you want to remove this contact? It cannot be undone"}
                                modalConfirmText={"Confirm Delete"}
                                modalAction={() => this.removeThisPerson(contact.id)}/>
            </div>;
        }

        return <section>
            <div className="card p-3" id="contact-card">
                <div className="card-body">
                    <p className="card-title"><FontAwesomeIcon
                        icon={faEnvelope}/> {contact.email ? contact.email : "No E-Mail Available"}</p>
                    <p className="card-title"><FontAwesomeIcon
                        icon={faGlobe}/> {contact.website ? contact.website : "No Website"} </p>
                </div>
                <PhoneData phones={contact.phones}/>
                <AddressData addresses={contact.addresses}/>
                <PersonalEvents eventData={events}/>
            </div>
            <br/>
            {ButtonText}
        </section>;
    }

    render() {
        let contents;
        let contact = this.state.contact;

        contents = this.state.loading
            ? <div><Loader/></div>
            : this.renderContactInfo(contact, this.state.personalEvents);

        return (
            <div>
                <Banner title={contact.firstName} subtitle={contact.lastName}/>
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
                    <th colSpan="2"><FontAwesomeIcon icon={faHome}/> Addresses</th>
                </tr>
                </thead>
                <tbody>
                {addresses.map(address =>
                    <tr key={address.addressId}>
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
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th colSpan="2"><FontAwesomeIcon icon={faCalendarDay}/> Events</th>
                </tr>
                </thead>
                <tbody>
                {events.map(e =>
                    <tr key={e.id}>
                        <td width="20%">{dateFormatter(e.startTime)}</td>
                        <td>{e.name}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    } else {
        return null;
    }
}