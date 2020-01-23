import React, { Component } from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import { Banner, Loader } from '../../components/Layout';
import { Link } from 'react-router-dom';
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
        };
    }

    componentDidMount() {
        this.populateUserData();
    }

    /**
     * Renders the contact list full out.
     *
     * @param {array} contacts  The Contacts Listing
     */
    static renderContactList(contacts) {
        return (<div>
            <Banner title="Contacts" subtitle={`${contacts.length} ${contacts.length > 1 ? "contacts" : "contact"}.`} />
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => <tr key={contact.id}>
                        <td><a href={"contact/" + contact.id}>{contact.firstName} {contact.lastName}</a></td>
                        <td>{contact.email}</td>
                    </tr>)}
                </tbody>
            </table>
            <div>
                <Link to="/add" className="btn btn-sm btn-primary">Add Contact</Link>
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
        await fetch(`api/People/phonebook/${merk}`, {
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
        await this.populateContactData(data);
    }
    
    render() {
        let contents = this.state.loading
            ? <div><Loader /></div>
            : this.state.contacts.length
                ? ContactList.renderContactList(this.state.contacts)
                : <div><p>There are no contacts.</p>
                    <div><Link to="/add" className="btn btn-sm btn-primary">Add Contact</Link></div>
                </div>;
        return (<div>
            {contents}
        </div>);
    }
}
