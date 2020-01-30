import React, {Component} from "react";
import authService from "../api-authorization/AuthorizeService";
import {Loader} from "../Layout";

/**
 * Creates a scrolling contact list
 */
export default class ContactScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            contacts: props.data ? props.data : []
        }
    }

    componentDidMount() {
        this.populateUserData();
    }

    /**
     * Populates the contact data for a section
     * @param {array} clump UserData in a clump
     */
    async populateContactData(clump) {
        const token = await authService.getAccessToken();
        const id = clump.sub;
        await fetch(`api/People/phonebook/${id}`, {
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        contacts: result,
                        loading: false
                    });
                    if (result.length < 1) this.setState({missingData: true,});
                }
            )
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
        await this.populateContactData(data);
    }

    contactListSelector(contacts) {
        return <div className="form-group">
            <label htmlFor="contactSelect"><h5>Available Contacts</h5></label>
            <select multiple className="form-control form-control-lg" id="contactSelect" size="20" name="participants">
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>;
    }

    render() {
        const contacts = this.state.contacts;
        let widget;

        if (this.state.loading) {
            return <div className="col-sm col-5-md py-auto"><Loader/></div>;
        }
        
        if (contacts.length > 0) {
            widget = this.contactListSelector(contacts);
        } else {
            widget = <div className="jumbotron border text-center shadow-sm">
                <h3>No contacts to add.</h3>
                <p className="lead">Please add contacts to your contacts list.</p></div>;
        }
        return <div className="col-sm col-5-md">{widget}</div>;
    }
}