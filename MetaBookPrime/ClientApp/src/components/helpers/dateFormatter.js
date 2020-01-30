/**
 * Formats the date returned.
 *
 * @param {Date} date The formatted date.
 */
export function dateFormatter(date) {
    const event = new Date(date);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };
    return event.toLocaleDateString('en-US', options);
}
