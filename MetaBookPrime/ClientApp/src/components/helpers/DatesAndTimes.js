import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
/**
 * Renders a React datepicker.
 * */
export default function DatesAndTimes() {
    // const [startingStartValue, startingEndValue] = props;
    const [startDate, setStartDate] = useState(new Date(Date.now()));
    const [endDate, setEndDate] = useState(new Date(Date.now() + 1));
    return (<section className="row">
        <div className="form-group col-sm mx-auto">
            <label className="label" htmlFor="startTime">Start</label>
            <br />
            <DatePicker 
            name="startTime" className="form-control form-control-sm" 
            selected={startDate} 
            onChange={date => setStartDate(date)} 
            showTimeSelect timeFormat="p" 
            timeIntervals={15} selectsStart 
            startDate={startDate} 
            endDate={endDate} 
            isClearable dateFormat="MMM d, yyyy h:mm aa" 
             />
        </div>
        <div className="form-group col-sm mx-auto">
            <label className="label" htmlFor="endTime">End</label>
            <br />
            <DatePicker 
            name="endTime" className="form-control form-control-sm" 
            selected={endDate} onChange={date => setEndDate(date)} 
            showTimeSelect timeFormat="p" timeIntervals={15} 
            selectsEnd 
            endDate={endDate} 
            minDate={startDate} 
            isClearable dateFormat="MMM d, yyyy h:mm aa" 
            />
        </div>
    </section>);
}
