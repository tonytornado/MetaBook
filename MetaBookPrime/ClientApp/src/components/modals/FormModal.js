import React, {useState} from 'react';
import {Button, Modal, ModalBody, ModalHeader} from 'reactstrap';

export function FormModal(props) {
    const {
        buttonLabel,
        modalTitle,
        showModal
    } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    };

    return (
        <div className="container-fluid">
            <Button color="danger" onClick={showModal} block>
                {buttonLabel}
            </Button>
            <Modal isOpen={props.modalState}
                   size="xl">
                <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                <ModalBody>
                        {props.children}
                </ModalBody>
            </Modal>
        </div>
    );
}