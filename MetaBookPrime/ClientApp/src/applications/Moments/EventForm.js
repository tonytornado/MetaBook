import React, { Component, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Banner } from '../../components/Layout';
import { WarningModal } from '../../components/Modals';
import ContactScroll from '../../components/contactScroller';


/**
 * Renders a React datepicker.
 * */
function DatesAndTimes() {
    const [startDate, setStartDate] = useState(new Date(Date.now()));
    const [endDate, setEndDate] = useState(new Date(Date.now() + 1));

    return (
        <section className="row">
            <div className="form-group col-sm mx-auto">
                <label className="label" htmlFor="startTime">Start</label>
                <br />
                <DatePicker
                    name="startTime"
                    className="form-control form-control-sm"
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    showTimeSelect
                    timeFormat="p"
                    timeIntervals={15}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    isClearable
                    dateFormat="MMM d, yyyy h:mm aa"
                />
            </div>
            <div className="form-group col-sm mx-auto">
                <label className="label" htmlFor="endTime">End</label>
                <br />
                <DatePicker
                    name="endTime"
                    className="form-control form-control-sm"
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    showTimeSelect
                    timeFormat="p"
                    timeIntervals={15}
                    selectsEnd
                    endDate={endDate}
                    minDate={startDate}
                    isClearable
                    dateFormat="MMM d, yyyy h:mm aa"
                />
            </div>
        </section>
    );
}

/**
 * Event creator form.
 */
export class EventCreator extends Component {
    static displayName = EventCreator.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handles the filling of the start date.
     * @param {DateTime} sdate 
     */
    handleChangeStartDate(sdate) {
        this.setState({
            startDate: sdate
        });
    };

    /**
     * Handles the filling of the end date.
     * @param {DateTime} edate 
     */
    handleChangeEndDate(edate) {
        this.setState({
            endDate: edate
        });
    };

    /**
     * Form submission handler.
     * @param {Mixed} e 
     */
    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        fetch('api/Events',
            {
                method: 'POST',
                body: data,
            }).then((res) => {
                if (res.ok) {
                    console.log("Perfect!");
                    console.log(res.json());
                    this.props.history.push('/events/');
                } else
                    this.showWarningModal(res.status);
                console.error("Post error: " + res.status);
            }).catch(e => {
                console.log("error: " + e);
            });;
    }

    static showWarningModal(status) {
        return <WarningModal text={status} />;
    }



    /**
     * Renders the form for the page.
     */
    formRender() {
        return (
            <form encType="multipart/form-data" onSubmit={this.handleSubmit} className="border rounded shadow p-3 row mx-auto">
                <div className="col-md">
                    <div className="form-group">
                        <label className="label"><h5>Event Name</h5></label>
                        <input
                            type="text" name="name" placeholder="What?" className="form-control form-control-lg" />
                    </div>
                    <div className="form-group">
                        <label><h5>Location</h5></label>
                        <input
                            type="text" name="location" placeholder="Where?" className="form-control form-control-lg" />
                    </div>
                    <div className="form-group">
                        <label className="label"><h5>Description</h5></label>
                        <textarea name="description" placeholder="Why?"
                            rows="7"
                            className="form-control form-control-lg"></textarea>
                    </div>
                    <DatesAndTimes />
                </div>
                <ContactScroll />
                <input type="submit" className="btn btn-primary btn-block" value="Submit" />
            </form>
        );
    }

    render() {
        let clamp = this.formRender();

        return <section>
            <Banner title="Add Event" subtitle="Create something." />
            {clamp}
        </section>
    }
}