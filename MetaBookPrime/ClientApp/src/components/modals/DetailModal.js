import React from 'react';
import {Button, Modal, ModalBody, ModalHeader} from 'reactstrap';

export function DetailModal(props) {
    return <div className="container-fluid">
        <Button outline color="dark" onClick={props.clicker} block>
            {props.buttonLabel}
        </Button>
        <Modal isOpen={props.opener}
               toggle={props.toggler}
               size="xl">
            <ModalHeader onClick={props.toggler}>Details</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    </div>;
}