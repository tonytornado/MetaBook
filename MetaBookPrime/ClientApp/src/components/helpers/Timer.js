import React, { useState, useEffect } from "react";

/**
 * Returns a clock that syncs to local
 */
export default function Timer() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const TimerId = setInterval(
            () => setTime(new Date()),
            1000
        );
        return () => {
            clearInterval(TimerId);
        }


    });

    return <FormattedTime date={time} />
}

/**
 * The dat
 * 
 * @param {DateTime} props The Time String
 */
function FormattedTime(props) {
    return <p className="lead">{props.date.toLocaleTimeString()}</p>;
}