import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-rainbow-components";
class Personal extends Component {
  state = {};
  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, inputChange } = this.props;
    return (
      <div className="form-container p-5">
        <h1 className="mb-5">Personal Details</h1>

        <div className="form-group">
          <label>Name</label>
          <input
            name="Name"
            value={values.name}
            onChange={inputChange("name")}
            className="form-control"
          ></input>
        </div>
        <div className="form-group">
          <label>Date Of Birth</label>
          {/* <DatePicker value={values.dob} onChange={inputChange("dob")} /> */}
          <div>
            <DatePicker selected={values.dob} onChange={inputChange("dob")} />
          </div>
        </div>
        <div className="form-group">
          <label>Bio</label>
          <input
            name="Bio"
            value={values.bio}
            onChange={inputChange("bio")}
            className="form-control"
          ></input>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            name="Location"
            value={values.location}
            onChange={inputChange("location")}
            className="form-control"
          ></input>
        </div>
        <div className="row pt-5">
          <div className=" text-right">
            <button className="btn btn-primary" onClick={this.continue}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Personal;
