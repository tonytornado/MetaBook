﻿import React, { Component } from 'react';
import { Banner } from '../../components/Layout';
import ContactScroll from '../../components/helpers/contactScroller';
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
            event: new EventData()
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount(props) {
        const {match: {params}} = this.props;
        const event_id = params.id;
        
        this.checkForEventData(event_id)
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
    }


    /**
     * Renders the form for the page.
     */
    formRender() {
        let event = this.state.event;

        return (
            <form encType="multipart/form-data" onSubmit={this.handleSubmit}
                className="border rounded shadow p-3 row mx-auto">
                <input type="hidden" name="id" defaultValue={this.state.event.id} />
                <div className="col-md">
                    <div className="form-group">
                        <label className="label"><h5>Event Name</h5></label>
                        <input
                            type="text" name="name" placeholder="What?" className="form-control form-control-lg" defaultValue={event.name} />
                    </div>
                    <div className="form-group">
                        <label><h5>Location</h5></label>
                        <input
                            type="text" name="location" placeholder="Where?" className="form-control form-control-lg" defaultValue={event.location} />
                    </div>
                    <div className="form-group">
                        <label className="label"><h5>Description</h5></label>
                        <textarea name="description"
                            placeholder="Why?"
                            rows="7"
                            className="form-control form-control-lg"
                            defaultValue={event.description} />
                    </div>
                    <DatesAndTimes />
                </div>
                <ContactScroll data={event.participants} />
                <input type="submit" className="btn btn-primary btn-block" value="Submit" />
            </form>
        );
    }

    render() {
        let clamp = this.formRender();

        return <section>
            <Banner title="Event!" subtitle="Make something happen." />
            {clamp}
        </section>
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
                    setTimeout(function () {
                        this.setState({ event: data })
                    }.bind(this), 1000)
                });
        }
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