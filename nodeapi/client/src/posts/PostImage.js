import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import DragDropImages from "./DragDropImages";
class PostImage extends Component {
  state = {
    showImage: false,
  };
  handleClose = () => {
    this.setState({ showImage: false });
  };
  render() {
    return (
      <>
        <Button
          type="button"
          onClick={() => {
            this.setState({ showImage: true });
            // console.log("showImage:", this.state.showImage);
          }}
        >
          Photo
        </Button>
        {/* <div className="h-75 d-inline-block"> */}
        <Modal show={this.state.showImage} onHide={this.handleClose}>
          <Modal.Header closeButton />
          <Modal.Body>
            <h4 className="text-center mb-3">Lets post pics!</h4>
            <DragDropImages />
          </Modal.Body>
        </Modal>
        {/* </div> */}
      </>
    );
  }
}

export default PostImage;
