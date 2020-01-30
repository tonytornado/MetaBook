import React, { Component } from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import { Banner, Loader } from '../../components/Layout';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPhone } from '@fortawesome/free-solid-svg-icons';

/**
 * Shows the contact list
 */
export default class ContactList extends Component {
    static displayName = ContactList.name;

    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            userData: [],
            loading: true,
            missingData: false,
            deleteSetting: false
        };
    }

    componentDidMount() {
        this.populateUserData();
        this.populateContactData(this.state.userData);
    }

    /**
     * Renders the contact list full out.
     *
     * @param {Boolean/Array} contacts  The Contacts Listing
     */
    static renderContactList(contacts) {
        if (contacts === false) {
            return (
                <div>
                    <Banner title="Contacts" subtitle="Uh... where are they?" />
                    <p className="text-center">There are no contacts.</p>
                    <Link to="contacts/add/" className="btn btn-sm btn-primary btn-block">Add Contact</Link>
                </div>
            );
        }

        return (
            <div>
                <Banner title="Contacts"
                    subtitle={`${contacts.length} ${contacts.length > 1 ? "contacts" : "contact"}.`} />
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => <tr key={contact.id}>
                            <td><a href={"contacts/" + contact.id}>{contact.firstName} {contact.lastName}</a></td>
                            <td>{contact.email}</td>
                            <td>{contact.addresses.length !== 0 && <FontAwesomeIcon icon={faHome} className="text-center" />}</td>
                            <td>{contact.phones.length !== 0 && <FontAwesomeIcon icon={faPhone} className="text-center"/>}</td>
                        </tr>)}
                    </tbody>
                </table>
                <div>
                    <Link to="/contacts/add/" className="btn btn-block btn-primary">Add Contact</Link>
                </div>
            </div>);
    }

    /**
     * Populates the contact data for a section
     * @param {array} clump UserData in a clump
     */
    async populateContactData(clump) {
        const token = await authService.getAccessToken();
        const merk = clump.sub;
        await fetch(`api/People/PersonalContacts/${merk}`, {
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
                    this.setState({ missingData: true, });
            });
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

    render() {
        let contents = this.state.loading
            ? <div><Loader /></div>
            : this.state.contacts.length
                ? ContactList.renderContactList(this.state.contacts)
                : ContactList.renderContactList(false);
        return (<div>
            {contents}
        </div>);
    }
}
