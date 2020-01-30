import React, {Component} from 'react';
import authService from "../../components/api-authorization/AuthorizeService";
import {Banner} from '../../components/Layout';


/**
 * A form for updating and creating new contacts in the application.
 **/
export default class ContactForm extends Component {
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
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    componentDidMount() {
        // Get user data
        this.populateUserData();

        const {match: {params}} = this.props;
        const contact_id = params.id;

        // Get the menu types
        this.getContactFormMenus();

        // Check for editable data
        this.checkForUserData(contact_id);
    }

    /**
     * Gets all the lists from the server
     */
    getContactFormMenus() {
        fetch("api/People/Phones").then(response => response.json())
            .then(data => {
                this.setState({phone: data});
            });
        // Get the address types
        fetch("api/People/Addresses").then(response => response.json())
            .then(data => {
                this.setState({address: data});
            });
        // Get the address types
        fetch("api/People/States").then(response => response.json())
            .then(data => {
                this.setState({states: data, loading: false});
            });
    }

    /**
     * Gets information about the contact and changes things around for the contact's data
     *
     * @param {int} id Id for the contact
     */
    checkForUserData(id) {
        if (id > 0) {
            this.setState({
                addPhone: true,
                addAddress: true
            });
            fetch(`api/People/details/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        contactData: data,
                        addPhone: data.phones.length !== 0,
                        addAddress: data.addresses.length !== 0
                    });
                    }
                )
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const token = await authService.getAccessToken();
        let col = this.state.contactData.id;

        if (col !== 0) {
            await fetch(`api/People/${col}`,
                {
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }).then((res) => {
                if (res.ok) {
                    console.log("Updated!");
                    this.props.history.push('/contacts');
                } else
                    console.error("Post error: " + res.status);
            }).catch(e => {
                console.log("error: " + e);
            });
        } else if (col === 0) {
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
                    this.props.history.push('/contacts');
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
        const userBits = this.state.userData;
        let classNamePhone = "btn btn-secondary";
        let classNameAddress = "btn btn-secondary";
        let addressText = this.state.addAddress ? "Remove Address" : "Add Address";
        let phoneText = this.state.addPhone ? "Remove Phone" : "Add Phone";

        if (this.state.addPhone) {
            classNamePhone += 'active';
        }

        if (this.state.addAddress) {
            classNameAddress += 'active';
        }

        return <main className="">
            <Banner title="Add Contact" subtitle="You might remember them later."/>
            <form onSubmit={this.handleSubmit} className="border p-3 rounded shadow-sm">
                <input type="hidden" name="id" defaultValue={dataBits.id}/>
                <input type="hidden" name="substring" defaultValue={userBits.sub}/>
                <MainForm data={dataBits}/>
                <hr/>
                <div className="btn-group-toggle btn-group btn-block" data-toggle="buttons">
                    <label htmlFor="phoneCheck" className={classNamePhone}>
                        <input type="checkbox"
                               id="phoneCheck"
                               onChange={this.handlePhoneChange}
                               name="phoneCheck" value="true"/>
                        {phoneText}
                    </label>
                    <label htmlFor="addressCheck" className={classNameAddress}>
                        <input type="checkbox"
                               id="addressCheck"
                               onChange={this.handleAddressChange}
                               name="addressCheck" value="true"/>
                        {addressText}
                    </label>
                </div>
                <br/>
                <PhoneForm
                    visible={this.state.addPhone}
                    phoneTypes={this.state.phone}
                    data={dataBits.phones}
                />
                <AddressForm
                    visible={this.state.addAddress}
                    addressTypes={this.state.address}
                    stateNames={this.state.states}
                    data={dataBits.addresses}
                />
                <button className="btn btn-primary btn-block my-3">Go!</button>
            </form>
        </main>;
    }

    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('connect/userinfo', {
            headers: !token ? {} : {'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({userData: data, loading: false});
    }
}

/**
 * A phone field that renders if needed.
 * @param {any} props
 * @return {null}
 */
function PhoneForm(props) {
    let caller; 
    props.data.length > 0
        ? caller = props.data[0] 
        : caller = new PhoneData();
    const phoneTypes = props.phoneTypes;

    if (props.visible) {
        let phones = phoneTypes.map(c =>
            <option key={c.value} value={c.name}>{c.name}</option>
        );

        return (
            <div className="py-2">
                <input type="hidden" name="phoneId" value={caller.phoneId} />
                <div className="form-group">
                    <label className="label" htmlFor="phoneNumber">Phone Number</label>
                    <input
                        name="phoneNumber" placeholder="Phone Number (10 digits only)" className="form-control"
                        defaultValue={caller.phoneNumber} />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="">Phone Type</label>
                    <select name="callerType" className="form-control" value={caller.callerType} onChange="">
                        <option/>
                        {phones}
                    </select>
                </div>

            </div>
        );
    } else {
        return null;
    }
}

/**
 * An Address Field that renders if needed.
 * @param {any} props
 * @return {null}
 */
function AddressForm(props) {
    let addy;
    props.data.length > 0
        ? addy = props.data[0] 
        : addy = new AddressData();
    const addressTypes = props.addressTypes;

    if (props.visible) {
        let addresses = addressTypes.map(c =>
            <option key={c.value} value={c.name}>{c.name}</option>
        );
        const stateNames = props.stateNames;
        let states = stateNames.map(c =>
            <option key={c.value} value={c.name}>{c.name}</option>
        );
        return (
            <div className="py-2">
                <input type="hidden" name="addressId" defaultValue={addy.addressId} />
                <div className="form-group">
                    <label className="label">Address Type</label>
                    <select name="addressType" className="form-control" value={addy.addressType}>
                        <option/>
                        {addresses}
                    </select>
                </div>
                <div className="form-group">
                    <label className="label">Street Name/Number</label>
                    <input
                        type="text" name="streetName" placeholder="House/Unit #, Street" className="form-control"
                        defaultValue={addy.streetName}/>
                </div>
                <div className="form-row">
                    <div className="form-group col-sm">
                        <label>City</label>
                        <input
                            type="text" name="cityName" placeholder="City" className="form-control"
                            defaultValue={addy.cityName}/>
                    </div>
                    <div className="form-group col-sm">
                        <label>State</label>
                        <select name="StateName" className="form-control" value={addy.stateName}>
                            <option/>
                            {states}
                        </select>
                    </div>
                    <div className="form-group col-sm">
                        <label>Postal Code</label>
                        <input
                            type="number" name="postalCode" placeholder="Zip" className="form-control"
                            defaultValue={addy.postalCode}/>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
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
                    <label className="label" htmlFor="firstName">First Name</label>
                    <input
                        type="text" name="firstName" className="form-control" defaultValue={mainFormData.firstName}/>
                </div>
                <div className="form-group col-sm">
                    <label className="label" htmlFor="lastName">Last Name</label>
                    <input
                        type="text" name="lastName" className="form-control" defaultValue={mainFormData.lastName}/>
                </div>
            </div>
            <div className="form-group">
                <label className="label" htmlFor="email">Email Address</label>
                <input
                    type="email" name="email" className="form-control" defaultValue={mainFormData.email}/>
            </div>
            <div className="form-group">
                <label className="label" htmlFor="website">Website</label>
                <input
                    type="url" name="website" className="form-control" placeholder="https://example.com"
                    defaultValue={mainFormData.website} pattern="https://.*"/>
            </div>
        </div>
    );
}

/**
 * Contact form data model class
 */
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
    phoneId = 0;
    phoneNumber = "";
    callerType = "";
}

class AddressData {
    addressId = 0;
    streetName = "";
    cityName = "";
    postalCode = "";
    stateName = "";
    addressType = "";
}