import React, { Component } from "react";
import { connect } from "react-redux";
import { getNotifications } from "../apiNotifications";
import {
  notificationAdded,
  getNotified,
  clearNotifications,
} from "../store/notifications";
class Notifications extends Component {
  state = {};
  componentDidMount() {
    this.props.clearNotifications();
    getNotifications()
      .then((response) => {
        return response.json();
      })
      .then((val) => {
        let notifications = val.notifications;
        notifications.map((notif) => {
          this.props.getNotified({
            id: notif._id,
            message: notif.message,
            read: notif.read,
            type: notif.notifType,
          });
        });
      });
  }
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

const mapDispatchToProps = (dispatch) => ({
  addNotification: (params) => dispatch(notificationAdded(params)),
  getNotified: (params) => dispatch(getNotified(params)),
  clearNotifications: () => dispatch(clearNotifications()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
