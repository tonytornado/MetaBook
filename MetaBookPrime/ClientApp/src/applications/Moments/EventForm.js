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
            event: props.event,
            userData: props.userData
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
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
            } else
                console.log(res.status);
        }).catch(e => {
            console.log("error: " + e);
        });

        this.props.onCloseEditModal();
    }


    /**
     * Renders the form for the page.
     */
    formRender() {
        let event = this.state.event;

        return <form encType="multipart/form-data" onSubmit={this.handleSubmit}
                     className="border rounded shadow p-3 row mx-auto">
            <input type="hidden" name="id" defaultValue={event.id}/>
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
            <ContactScroll/>
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

export class EventData {
    id = 0;
    name = "";
    startTime = new Date();
    endTime = new Date();
    location = "";
    description = "";
    participants = [];
    color = "None";
}