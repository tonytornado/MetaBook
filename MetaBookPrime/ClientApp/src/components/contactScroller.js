import React, { Component } from "react";

/**
 * Creates a scrolling contact list
 */
export class ContactScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactData: [],
            loaded: false
        }
    }

    componentDidMount() {
        
    }

    render() {
        const contacts = this.state.contactData;

        return (
            <div className="col-4-auto">
                {contacts.map(c => {
                    <p>c.FirstName c.Lastname</p>
                })}
            </div>
        );
    }
}