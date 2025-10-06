import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const FullScreenModel = ({ model, closeModel=()=>{}, ...props }) => {

    return (
        <div className="FullScreenModel">
            <Modal isOpen={model}  className="fullscreen-modal">
                <ModalHeader >Full Page Modal</ModalHeader>
                <ModalBody>
                    {props.children}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" >
                        Confirm
                    </Button>
                    <Button color="secondary" onClick={() => closeModel()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default FullScreenModel;
