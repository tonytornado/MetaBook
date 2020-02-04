import React, {Component} from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import {Banner, Loader} from '../../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faHome, faPhone, faPlusCircle, faTimes} from '@fortawesome/free-solid-svg-icons';
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
            modal: null
        };

        this.toggle = this.toggle.bind(this);
        this.removeThisPerson = this.removeThisPerson.bind(this);
    }

    componentDidMount() {
        this.populateUserData();
    }

    /**
     * Toggles the modals in this list
     * 
     * @param {String} set      Form/Detail
     * @param {Number} modal    Modal Id
     */
    toggle(set, modal) {
        console.log(modal);
        if (this.state.modal) {
            this.setState({
                modal: null
            });
        } else {
            if (set === 'form') {
                this.setState({
                    modal: `form${modal.id}`
                })
            } else {
                this.setState({
                    modal: `detail${modal.id}`
                })
            }
        }
    }

    toggleReload(){
        this.setState({
            modal: null
        });
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

    /**
     * Removes a contact from the system
     * 
     * @param {Number} id   Contact Id
     */
    async removeThisPerson(id) {
        const token = await authService.getAccessToken();
        fetch(`api/People/${id}`,
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
                opener={this.state.modal === `form0`}
                toggler={this.toggle}
                clicker={this.toggle.bind(this, `form`, new ContactData())}
                block={true}
                buttonLabel={<FontAwesomeIcon icon={faPlusCircle}/>}
            >
                <ContactForm
                    userData={this.state.userData}
                    contact={new ContactData()}
                    onSendFormClose={this.toggle}
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
                                    {/* Modal for editing */}
                                    <FormModal
                                        opener={this.state.modal === `form${contact.id}`}
                                        toggler={this.toggle}
                                        clicker={this.toggle.bind(this, `form`, contact)}
                                        block={false}
                                        buttonLabel={<FontAwesomeIcon icon={faEdit}/>}
                                    >
                                        <ContactForm
                                            id={contact.id}
                                            contact={contact}
                                            userData={this.state.userData}
                                            onSendFormClose={this.toggle}
                                        />
                                    </FormModal>

                                    {/* modal for deleting */}
                                    <VersatileModal buttonLabel={<FontAwesomeIcon icon={faTimes}/>}
                                                    buttonClass={"danger"}
                                                    modalTitle={`Delete ${contact.firstName}?`}
                                                    modalText={"Are you sure you want to remove this contact? It cannot be undone"}
                                                    modalConfirmText={"Confirm Delete"}
                                                    modalAction={() => this.removeThisPerson(contact.id)}/>
                                </div>
                            </td>
                            <td>
                                {/* modal for viewing details of contact */}
                                <DetailModal
                                    opener={this.state.modal === `detail${contact.id}`}
                                    toggler={this.toggle}
                                    clicker={this.toggle.bind(this, `detail`, contact)}
                                    block={false}
                                    buttonLabel={`${contact.name}`}
                                >
                                    <Contact
                                        id={contact.id}
                                        userData={this.state.userData}
                                        contact={contact}
                                        onSendFormClose={this.toggle}
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

