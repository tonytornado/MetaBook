import React from 'react';
import {Button, Modal, ModalBody, ModalHeader} from 'reactstrap';

export function DetailModal(props) {
    const {
        linkLabel,
        showModal,
        modalState
    } = props;

    return <div className="container-fluid">
        <Button color="outline" onClick={showModal}>
            {linkLabel}
        </Button>
        <Modal isOpen={modalState}
               size="xl">
            <ModalHeader onClick={showModal}>Details</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    </div>;
}