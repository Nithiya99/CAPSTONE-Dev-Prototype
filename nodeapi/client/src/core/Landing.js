import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container">
      <div className="jumbotron">
        <h3>Hello, Welcome to our collaboration portal</h3>
        <h5>Meet, Share, Grow</h5>
        <Link to="/signin" className="btn btn-primary">
          Join our community!
        </Link>
      </div>
    </div>
  );
}
