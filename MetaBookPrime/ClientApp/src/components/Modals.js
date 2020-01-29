import React from 'react';

/**
 * Shows a warning modal.
 * @param {} props 
 */
export function CautionModal(props) {
    if (!props.operationType) {
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
}

/**
 * Returns a simple warning modal
 * @param {string} props 
 */
export function WarningModal(props) {
    const {text} = props;
    
    if (!text) {
        return (
            <div>
                <p>Something bad happened.</p>
                <p>{text}</p>
                <div className="border rounded shadow-lg p-3">
                    <button className="btn btn-secondary">Continue</button>
                </div>
            </div>
        );
    }
}