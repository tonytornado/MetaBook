import React from 'react';

/**
 * Shows a warning modal.
 * @param {Mixed} props 
 */
export function CautionModal(props) {
    if (props.operationType) {
        return;
    }

    return (
        <div>
            <p>Are you sure you want to {props.operationType} this {props.itemType}</p>
            <div>
                <button>Yes</button>
                <button>No</button>
            </div>
        </div>
    );
}

/**
 * Returns a simple warning modal
 * @param {string} props 
 */
export function WarningModal(props) {
    if (props.text) {
        return;
    }

    return (
        <div>
            <p>Something bad happened.</p>
            <p>{props.text}</p>
            <div>
                <button className="btn btn-secondary">Continue</button>
            </div>
        </div>
    );
}