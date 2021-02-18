import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getUserById } from "../user/apiUser";
import Requests from "./Requests";

const RoleReq = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { requestBy, projectId, roleId } = props;

  return (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        View
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Requests for this role</Modal.Title>
        </Modal.Header>
        <Modal.Body scrollable="true">
          {requestBy.map((req) => (
            <Requests reqId={req} projectId={projectId} roleId={roleId} />
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RoleReq;
