import React, { Component } from "react";
import { Card } from "react-bootstrap";
class Post extends Component {
  state = {};
  render() {
    const { headerText, footerText, cardText, imageUrl } = this.props;
    return (
      <>
        <Card className="m-5">
          <Card.Header>{headerText}</Card.Header>
          <Card.Body className="col d-flex justify-content-center">
            {/* <Col> */}
            <Card.Img
              style={{
                width: "30vw",
                height: "25vw",
                "object-fit": "cover",
              }}
              variant="top"
              src={imageUrl}
            />
            {/* </Col>
                        <Col> */}
            {/* </Col> */}
          </Card.Body>
          <Card.Body>
            <Card.Text className="p-2 ml-1">{cardText}</Card.Text>
          </Card.Body>
          <Card.Footer>{footerText}</Card.Footer>
        </Card>
      </>
    );
  }
}

export default Post;
