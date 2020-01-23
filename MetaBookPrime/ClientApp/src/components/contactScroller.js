import React, { Component } from "react";
import authService from "./api-authorization/AuthorizeService";

/**
 * Creates a scrolling contact list
 */
export default class ContactScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            contacts: []
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
        const merk = clump.sub;
        await fetch(`api/People/phonebook/${merk}`, {
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
                    if (result.length < 1) this.setState({ missingData: true, });
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
        await this.populateContactData(data);
    }

    render() {
        const contacts = this.state.contacts;

        return (
            <div className="form-group col-sm col-5-md">
                <label for="contactSelect"><h5>Available Contacts</h5></label>
                <select multiple className="form-control form-control-lg" id="contactSelect" size="20" name="participants">
                    {contacts.map(c =>
                        <option key={c.id} value={c.id}>{c.name}</option>
                    )}
                </select>
            </div>
        );
    }
}