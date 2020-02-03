import React, {Component} from 'react';
import {Banner} from '../../components/Layout';
import ContactScroll from '../../components/helpers/ContactScroll';
import DatesAndTimes from '../../components/helpers/DatesAndTimes';
import authService from "../../components/api-authorization/AuthorizeService";


/**
 * Event form.
 */
export default class EventForm extends Component {
    static displayName = EventForm.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            event: new EventData(),
            userData: this.props.userData
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // this.populateUserData();
        this.checkForEventData(this.props.id);
    }

    /**
     * Form submission handler.
     * @param {Event} e
     */
    async handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const token = await authService.getAccessToken();

        fetch('api/Events',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
                body: data,
            }).then((res) => {
            if (res.ok) {
                console.log("Perfect!");
                console.log(res.json());
                this.props.history.push('/events/');
            } else
                console.log(res.status);
            console.error("Post error: " + res.status);
        }).catch(e => {
            console.log("error: " + e);
        });

        this.props.onCloseEditModal();
    }

    /**
     * Checks for user data
     */
    async populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('connect/userinfo', {
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        this.setState({userData: data, loading: false});
    }

    /**
     * Gets information about the event and changes things around for the event's data
     *
     * @param {int} id Id for the event
     */
    checkForEventData(id) {
        if (id > 0) {
            fetch(`api/Events/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        event: data
                    })
                })
        }
    }


    /**
     * Renders the form for the page.
     */
    formRender() {
        let event = this.state.event;

        return <form encType="multipart/form-data" onSubmit={this.handleSubmit}
                     className="border rounded shadow p-3 row mx-auto">
            <input type="hidden" name="id" defaultValue={this.state.event.id}/>
            <input type="hidden" name="ownerId" defaultValue={this.state.userData.sub}/>
            <div className="col-md">
                <div className="form-group">
                    <label className="label"><h5>Event Name</h5></label>
                    <input
                        type="text" name="name" placeholder="What?" className="form-control form-control-lg"
                        defaultValue={event.name}/>
                </div>
                <div className="form-group">
                    <label><h5>Location</h5></label>
                    <input
                        type="text" name="location" placeholder="Where?" className="form-control form-control-lg"
                        defaultValue={event.location}/>
                </div>
                <div className="form-group">
                    <label className="label"><h5>Description</h5></label>
                    <textarea name="description"
                              placeholder="Why?"
                              rows="7"
                              className="form-control form-control-lg"
                              defaultValue={event.description}/>
                </div>
                <DatesAndTimes/>
            </div>
            <ContactScroll />
            <input type="submit" className="btn btn-primary btn-block" value="Submit"/>
        </form>;
    }

    render() {
        return <section>
            <Banner title="Event!" subtitle="Make something happen."/>
            {this.formRender()}
        </section>
    }
}

class EventData {
    id = 0;
    name = "";
    startTime = new Date();
    endTime = new Date();
    location = "";
    description = "";
    participants = [];
    color = "None";
}