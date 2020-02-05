import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

export function DetailModal(props) {
    return <div>
        <Button color="link" tag="a" className="text" onClick={props.clicker}>
            {props.buttonLabel}
        </Button>
        <Modal isOpen={props.opener}
            toggle={props.toggler}
            size="xl"
            className="rounded shadow-lg">
            <ModalHeader toggle={props.toggler}>Details</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    </div>;
}