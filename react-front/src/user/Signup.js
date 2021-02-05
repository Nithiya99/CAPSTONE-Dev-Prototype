import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import SignupForm from "./SignupForm";

function Signup() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
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
          <SignupForm />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default Signup;
