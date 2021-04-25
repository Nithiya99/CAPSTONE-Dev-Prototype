import React, { Component } from "react";
import { connect } from "react-redux";
class Notifications extends Component {
  state = {};

  render() {
    let { notifications } = this.props;
    // if (this.props.notifications.length > 0)
    // console.log(this.props.notifications);
    if (notifications.length === 0) {
      return <>No Notifsss</>;
    }
    return (
      <div className="mt-5">
        <h1>Notifications</h1>
        <div className="container">
          <p>
            {notifications.map((notif) => (
              <h4>{notif.message}</h4>
            ))}
          </p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
});
export default connect(mapStateToProps, null)(Notifications);
