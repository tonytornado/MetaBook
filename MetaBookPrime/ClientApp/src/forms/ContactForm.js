import React, { Component } from 'react';
import authService from "../components/api-authorization/AuthorizeService";


/**
 * A phone field that renders if needed.
 * @param {any} props
 */
function PhoneForm(props) {
    if (!props.visible) {
        return null;
    }
    let caller = props.data ? props.data : new PhoneData();
    const phoneTypes = props.phoneTypes;
    let phones = phoneTypes.map(c =>
        <option key={c.value} value={c.name}>{c.name}</option>
    );

    return (
        <div className="border p-2">
            <div className="form-group">
                <label className="label">Phone Number</label>
                <input
                    name="phoneNumber" placeholder="Phone Number (10 digits only)" className="form-control" defaultValue={caller.phoneNumber} />
            </div>
            <div className="form-group">
                <label className="label">Phone Type</label>
                <select name="CallerType" className="form-control" defaultValue={caller.callerType}>
                    <option></option>
                    {phones}
                </select>
            </div>

        </div>
    );
}

/**
 * An Address Field that renders if needed.
 * @param {any} props
 */
function AddressForm(props) {
    if (!props.visible) {
        return null;
    }

    let addy = props.data ? props.data : new AddressData();

    const addressTypes = props.addressTypes;
    let addresses = addressTypes.map(c =>
        <option key={c.value} value={c.name}>{c.name}</option>
    );

    const stateNames = props.stateNames;
    let states = stateNames.map(c =>
        <option key={c.value} value={c.name}>{c.name}</option>
    );

    return (
        <div className="border p-2">
            <div className="form-group">
                <label className="label">Address Type</label>
                <select name="addressType" className="form-control" defaultValue={addy.AddressType}>
                    {addresses}
                </select>
            </div>
            <div className="form-group">
                <label className="label">Street Name/Number</label>
                <input
                    type="text" name="streetName" placeholder="House/Unit #, Street" className="form-control"
                    value={addy.streetName} />
            </div>
            <div className="form-row">
                <div className="form-group col-sm">
                    <label>City</label>
                    <input
                        type="text" name="cityName" placeholder="City" className="form-control" defaultValue={addy.cityName} />
                </div>
                <div className="form-group col-sm">
                    <label>State</label>
                    <select name="StateName" className="form-control" defaultValue={addy.stateName}>
                        <option></option>
                        {states}
                    </select>
                </div>
                <div className="form-group col-sm">
                    <label>Postal Code</label>
                    <input
                        type="number" name="postalCode" placeholder="Zip" className="form-control" defaultValue={addy.postalCode} />
                </div>
            </div>
        </div>
    );
}

/**
 * Main body for the form.
 * */
function MainForm(props) {
    const mainFormData = props.data;

    return (
        <div>
            <div className="row">
                <div className="form-group col-sm">
                    <label className="label">First Name</label>
                    <input
                        type="text" name="firstName" className="form-control" defaultValue={mainFormData.firstName} />
                </div>
                <div className="form-group col-sm">
                    <label>Last Name</label>
                    <input
                        type="text" name="lastName" className="form-control" defaultValue={mainFormData.lastName} />
                </div>
            </div>
            <div className="form-group">
                <label className="label">Email Address</label>
                <input
                    type="email" name="email" className="form-control" defaultValue={mainFormData.email} />
            </div>
            <div className="form-group">
                <label className="label">Website</label>
                <input
                    type="url" name="website" className="form-control" placeholder="https://example.com"
                    defaultValue={mainFormData.website} pattern="https://.*" />
            </div>
        </div>
    );
}

/**
 * A form for updating and creating new contacts in the application.
 **/
export class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            address: [],
            phone: [],
            states: [],
            addAddress: false,
            addPhone: false,
            contactData: new ContactData(),
            userData: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    componentDidMount() {
        this.populateUserData();
        const { match: { params } } = this.props;
        var contact_id = params.id;

        // Get the phone types
        fetch("api/People/Phones").then(response => response.json())
            .then(data => {
                this.setState({ phone: data });
            });

        // Get the address types
        fetch("api/People/Addresses").then(response => response.json())
            .then(data => {
                this.setState({ address: data });
            });

        // Get the address types
        fetch("api/People/States").then(response => response.json())
            .then(data => {
                this.setState({ states: data, loading: false });
            });

        this.checkForUserData(contact_id);
    }

    checkForUserData(id) {
        if (id > 0) {
            document.getElementById('phoneCheck').checked = true;
            document.getElementById("addressCheck").checked = true;
            if (this.state.contactData.addresses) this.handleAddressChange();
            if (this.state.contactData.phones) this.handlePhoneChange();

            fetch(`api/People/${id}`)
                .then(response => response.json())
                .then(data => {
                    setTimeout(function () {
                        this.setState({ contactData: data })
                    }.bind(this), 1000)
                });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const token = await authService.getAccessToken();

        if (data.id) {
            await fetch(`api/People/${data.id}`,
                {
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }).then((res) => {
                    if (res.ok) {
                        console.log("Updated!");
                        console.log(res.json());
                        this.props.history.push('/directory');
                    } else
                        console.error("Post error: " + res.status);
                }).catch(e => {
                    console.log("error: " + e);
                });
        }
        else {
            await fetch('api/People',
                {
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    },
                    method: 'POST',
                    body: data
                }).then((res) => {
                    if (res.ok) {
                        console.log("Perfect!");
                        console.log(res.json());
                        this.props.history.push('/directory');
                    } else
                        console.error("Post error: " + res.status);
                }).catch(e => {
                    console.log("error: " + e);
                });
        }
    }

    handleAddressChange() {
        this.setState(state => ({
            addAddress: !state.addAddress
        }));
    }

    handlePhoneChange() {
        this.setState(state => ({
            addPhone: !state.addPhone
        }));
    }

    render() {
        const dataBits = this.state.contactData;

        return (
            <main>
                <form onSubmit={this.handleSubmit} className="border p-3 rounded">
                    <input type="hidden" name="substring" defaultValue={this.state.userData.sub} />
                    <MainForm data={dataBits} />
                    <hr />
                    <div className="form-check">
                        <input type="checkbox" id="phoneCheck" className="form-check-input" onClick={this.handlePhoneChange} name="phoneCheck" value="true" />
                        <label htmlFor="phoneCheck" className="form-check-label">Add phone?</label>

                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="addressCheck" className="form-check-input" onClick={this.handleAddressChange} name="addressCheck" value="true" />
                        <label htmlFor="addressCheck" className="form-check-label">Add address?</label>
                    </div>
                    <br />
                    <AddressForm
                        visible={this.state.addAddress}
                        addressTypes={this.state.address}
                        stateNames={this.state.states}
                        data={dataBits.addresses}
                    />
                    <PhoneForm
                        visible={this.state.addPhone}
                        phoneTypes={this.state.phone}
                        data={dataBits.phones}
                    />
                    <button className="btn btn-primary btn-block" >Go!</button>
                </form>
            </main>
        );
    }

    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('connect/userinfo', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ userData: data, loading: false });
    }
}



class ContactData {
    id = 0;
    firstName = "";
    lastName = "";
    email = "";
    website = "";
    cityName = "";
    stateName = "";
    addresses = [];
    phones = [];
}

class PhoneData {
    id = 0;
    phoneNumber = "";
    callerType = "";
}

class AddressData {
    id = 0;
    streetName = "";
    cityName = "";
    postalCode = "";
    stateName = "";
    AddressType = "";
}