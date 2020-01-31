import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function FormModal(props){
    const {
      buttonLabel,
      className,
      modalFormContent,
      modalTitle,
    } = props;
  
    const [modal, setModal] = useState(false);
    const [unmountOnClose] = useState(true);
    // const [infoData, setInfoData] = useState([]);
  
    const toggle = () => setModal(!modal);
    // const stateManage = (data) => setInfoData(data);
    // const setUnmountOnClose;

    // const handleModalToggle = (tag) => setModal(tag); 
  
    return (
        <div>
            <Button color="danger" onClick={toggle} block>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} unmountOnClose={unmountOnClose} size="xl">
                <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                <ModalBody>
                    {modalFormContent}
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="primary" onClick={toggle} block>{modalAction}</Button>{' '} */}
                    {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                </ModalFooter>
            </Modal>
        </div>
    );
}