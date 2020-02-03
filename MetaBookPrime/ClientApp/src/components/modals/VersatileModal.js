import React, {useState} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

/**
 * Creates a modal that drops down with a backdrop.
 * Properties can be set from the component.
 *
 * @param {Array} props Properties from component
 */
export function VersatileModal(props) {
    const {
        buttonLabel,
        buttonClass,
        className,
        modalTitle,
        modalText,
        modalConfirmText,
        modalAction,
    } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const toggleAction = modalAction;

    const doubleAction = () => {
        toggleAction();
        toggle();
    };

    const externalCloseBtn = <button className="close" style={{position: 'absolute', top: '15px', right: '15px'}}
                                     onClick={toggle}>&times;</button>;
    return (
        <>
            <Button color={buttonClass} onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} external={externalCloseBtn}>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalBody>
                    {modalText}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={doubleAction}>{modalConfirmText}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

