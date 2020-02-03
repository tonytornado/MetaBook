import React, {Component} from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import {Banner, Loader} from '../../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faHome, faPhone, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FormModal} from '../../components/modals/FormModal';
import ContactForm, {ContactData} from './ContactForm';
import {DetailModal} from "../../components/modals/DetailModal";
import Contact from "./Contact";
import {VersatileModal} from "../../components/modals/VersatileModal";

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
            formModalState: false,
            detailModalState: false,
            editModalState: false,
        };

        this.populateUserData = this.populateUserData.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleDetailModalChange = this.handleDetailModalChange.bind(this);
        this.handleEditModalChange = this.handleEditModalChange.bind(this);
        this.handleFormModalChange = this.handleFormModalChange.bind(this);
    }

    componentDidMount() {
        this.populateUserData();
    }

    handleDetailModalChange() {
        this.setState({
            detailModalState: !this.state.detailModalState
        });
    };

    handleEditModalChange() {
        this.setState({
            editModalState: !this.state.editModalState
        });
    };

    handleFormModalChange() {
        this.setState({
            formModalState: !this.state.formModalState
        });
        this.populateContactData(this.state.userData);
    };

    handleFormClose() {
        this.handleFormModalChange();
        this.populateContactData(this.state.userData);
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
                } else {
                    console.error("Could not delete: " + res.status);
                }
            }).catch(error => {
            console.error(error)
        });
        this.populateContactData(this.state.userData);
    }

    render() {
        const modalSpace =
            <FormModal
                buttonLabel={"Add Contact"}
                modalAction={"toggle"}
                modalTitle={"Add A New Contact"}
                block={true}
                modalState={this.state.formModalState}
                showModal={this.handleFormModalChange}>
                <ContactForm
                    userData={this.state.userData}
                    contact={new ContactData()}
                    onSendFormClose={this.handleFormClose}
                />
            </FormModal>;

        let contacts = this.state.contacts;

        if (this.state.loading) {
            return <div><Loader/></div>;
        }
        if (contacts.length !== 0) {
            return <div>
                <Banner
                    title="Contacts"
                    subtitle={`${contacts.length} ${contacts.length > 1 ? "contacts" : "contact"}.`}/>
                <table className="table table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contacts.map(contact =>
                        <tr key={contact.id}>
                            <td>
                                <div className="btn-group btn-group-sm">
                                    <FormModal
                                        buttonLabel={<FontAwesomeIcon icon={faEdit}/>}
                                        modalTitle={"Edit Contact"}
                                        modalState={this.state.editModalState}
                                        showModal={this.handleEditModalChange}
                                        block={false}>
                                        <ContactForm
                                            id={contact.id}
                                            contact={contact}
                                            userData={this.state.userData}
                                            onSendFormClose={this.handleEditModalChange}
                                        />
                                    </FormModal>
                                    <VersatileModal buttonLabel={<FontAwesomeIcon icon={faTimes}/>}
                                                    buttonClass={"danger"}
                                                    modalTitle={`Delete ${contact.firstName}?`}
                                                    modalText={"Are you sure you want to remove this contact? It cannot be undone"}
                                                    modalConfirmText={"Confirm Delete"}
                                                    modalAction={() => this.removeThisPerson(contact.id)}/>
                                </div>
                            </td>
                            <td>
                                <DetailModal
                                    linkLabel={`${contact.name}`}
                                    showModal={this.handleDetailModalChange}
                                    modalState={this.state.detailModalState}
                                >
                                    <Contact
                                        id={contact.id}
                                        userData={this.state.userData}
                                        contact={contact}
                                        onSendFormClose={this.handleDetailModalChange}
                                    />
                                </DetailModal>
                            </td>
                            <td>{contact.email}</td>
                            <td>{contact.addresses.length !== 0 &&
                            <FontAwesomeIcon icon={faHome} className="text-center"/>}</td>
                            <td>{contact.phones.length !== 0 &&
                            <FontAwesomeIcon icon={faPhone} className="text-center"/>}</td>
                        </tr>)}
                    </tbody>
                </table>
                {modalSpace}
            </div>;
        } else {
            return <div>
                <Banner title="Contacts" subtitle="Uh... where are they?"/>
                <p className="text-center">There are no contacts.</p>
                {modalSpace}
            </div>
        }
    }
}

