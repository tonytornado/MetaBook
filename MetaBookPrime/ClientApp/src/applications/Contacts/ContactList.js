import React, {Component} from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import {Banner, Loader} from '../../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faPhone} from '@fortawesome/free-solid-svg-icons';
import {FormModal} from '../../components/modals/FormModal';
import ContactForm from './ContactForm';

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
            modalState: false
        };

        this.populateUserData = this.populateUserData.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
    }

    componentDidMount() {
        this.populateUserData();
    }

    handleModalChange() {
        this.setState({
            modalState: !this.state.modalState
        });
    }

    handleFormClose() {
        this.handleModalChange();
        this.populateUserData();
    }

    /**
     * Populates the contact data for a section
     * @param {Array} clump UserData in a clump
     */
    async populateContactData(clump) {
        const token = await authService.getAccessToken();
        const sub = clump.sub;
        await fetch(`api/People/PersonalContacts/${sub}`, {
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
                    this.setState({missingData: true,});
            });
    }

    /**
     * Grabs user data from the server after verifying with token
     */
    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('/connect/userinfo', {
            headers: !token ? {} : {'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({
            userData: data
        });
        this.populateContactData(this.state.userData);
    }

    render() {
        const modalSpace =
            <FormModal
                buttonLabel={"Add contact"}
                modalAction={"toggle"}
                modalTitle={"Add Contact"}
                modalState={this.state.modalState}
                showModal={this.handleModalChange} >
                <ContactForm
                    userData={this.state.userData}
                    contactData={null}
                    onSendFormClose={this.handleFormClose}
                />
            </FormModal>;

        let contacts = this.state.contacts;
        
        if (this.state.loading) {
            return <div><Loader/></div>;
        }
        if (contacts.length !== 0) {
            return (
                <div>
                    <Banner
                        title="Contacts"
                        subtitle={`${contacts.length} ${contacts.length > 1 ? "contacts" : "contact"}.`}/>
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
                        {contacts.map(contact => contactRow(contact))}
                        </tbody>
                    </table>
                    {modalSpace}
                </div>
            );
        } else {
            return <div>
                <Banner title="Contacts" subtitle="Uh... where are they?"/>
                <p className="text-center">There are no contacts.</p>
                {modalSpace}
            </div>
        }
    }
}

function contactRow(contact) {
    return <tr key={contact.id}>
        <td><a href={"contacts/" + contact.id}>{contact.firstName} {contact.lastName}</a></td>
        <td>{contact.email}</td>
        <td>{contact.addresses.length !== 0 && <FontAwesomeIcon icon={faHome} className="text-center"/>}</td>
        <td>{contact.phones.length !== 0 && <FontAwesomeIcon icon={faPhone} className="text-center"/>}</td>
    </tr>;
}

