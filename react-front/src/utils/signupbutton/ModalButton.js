import React, { useState } from "react";
import Form from "./Form";
import { Button, Modal } from "react-bootstrap";
const ModalButton = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      {" "}
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        Signup
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Join the Community</Modal.Title>
        </Modal.Header>
        <Modal.Body scrollable="true">
          <Form />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalButton;
