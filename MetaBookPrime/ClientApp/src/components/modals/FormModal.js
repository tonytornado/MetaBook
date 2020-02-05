import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

export function FormModal(props) {
    return <>
        <Button color="primary" onClick={props.clicker} block={props.block}>
            {props.buttonLabel}
        </Button>
        <Modal isOpen={props.opener}
            toggle={props.toggler}
            size="xl"
            className="rounded shadow-lg">
            <ModalHeader toggle={props.toggler}>{props.modalTitle}</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    </>;
}