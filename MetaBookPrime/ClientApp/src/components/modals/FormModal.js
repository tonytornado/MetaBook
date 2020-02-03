import React from 'react';
import {Button, Modal, ModalBody, ModalHeader} from 'reactstrap';

export function FormModal(props) {
    const {
        buttonLabel,
        block,
        modalTitle,
        showModal
    } = props;

    return <>
        <Button color="primary" onClick={showModal} block={block}>
            {buttonLabel}
        </Button>
        <Modal isOpen={props.modalState}
               size="xl">
            <ModalHeader onClick={showModal}>{modalTitle}</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    </>;
}