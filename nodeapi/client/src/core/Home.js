import React, { Component } from "react";
import { connect } from "react-redux";
import { getNotifications } from "../apiNotifications";
import {
  notificationAdded,
  getNotified,
  clearNotifications,
} from "../store/notifications";
import * as _ from "lodash";
import { getCurrentUser } from "../user/apiUser";
import ProjectRecommendation from "./ProjectRecommendation";
import { getProject } from "../project/apiProject";
import { listmyprojects } from "./../project/apiProject";
import { Modal, Button } from "react-bootstrap";
import RatingComponent from "../project/RatingComponent";
class Home extends Component {
  state = {
    notificationGroupedObject: {},
    show: false,
  };
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
            type: notif.notifType,
            id: notif._id,
            message: notif.message,
            read: notif.read,
            projectId: notif.projectId ? notif.projectId : "none",
          });
        });
        let notificationGroupedObject = _.groupBy(notifications, "notifType");
        this.setState({ notificationGroupedObject });
      });
    listmyprojects().then((projects) =>
      this.setState({ projects: projects.userProjects })
    );
  }
  getProjectTeamFromState = (projectId) => {
    return this.state.projects.map((project) => {
      if (project._id.toString() === projectId.toString()) {
        return project.team;
      }
    });
    // return undefined;
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  render() {
    if (getCurrentUser()._id === undefined) return;
    const { notifications } = this.props;
    const { notificationGroupedObject, projects } = this.state;
    // if (this.props.notifications.length > 0) {
    //   console.log("NOTIFICATIONS:");
    //   console.log(this.props.notifications);
    // }
    // notifications.map((notif) => {
    //   console.log(notif);
    // });

    // console.log(notificationGroupedObject);
    // console.log(projects);
    if (
      Object.keys(notificationGroupedObject).length !== 0 &&
      projects !== undefined &&
      notificationGroupedObject.FeedbackForm !== undefined
    ) {
      if (notificationGroupedObject["FeedbackForm"].length > 0) {
        console.log("Feedback Forms:");
        console.log(notificationGroupedObject.FeedbackForm);
      }
      //   this.setState({ show: true });

      //   console.log(notificationGroupedObject.FeedbackForm);
      //   let arr = notificationGroupedObject.FeedbackForm;
      //   arr.map((notif) => {
      //     if (notif.projectId) {
      //       // console.log(notif.projectId);
      //       const team = this.getProjectTeamFromState(notif.projectId);
      //       console.log(team[team.length - 1]);
      //       //   }
      //       // });
      //       const { show } = this.state;
      //       return (
      //         <>
      //           <Modal
      //             show={show}
      //             onHide={this.handleClose}
      //             backdrop="static"
      //             keyboard={false}
      //           >
      //             <Modal.Header closeButton>
      //               <Modal.Title>
      //                 Lets Give your amazing team some Feedback!
      //               </Modal.Title>
      //             </Modal.Header>
      //             <Modal.Body scrollable="true">
      //               (
      //               <>
      //                 <RatingComponent
      //                   team={team[team.length - 1]}
      //                   rating={this.state.rating}
      //                   // handleValueChange={this.handleValueChange}
      //                 />
      //                 <Button
      //                   onClick={() => {
      //                     const { rating } = this.state;
      //                     // console.log(rating);
      //                     this.submitproject();
      //                     this.setState({ show: false });
      //                   }}
      //                 >
      //                   Submit
      //                 </Button>
      //               </>
      //               )
      //             </Modal.Body>
      //           </Modal>
      //         </>
      //       );
      //     }
      //   });
      //   this.setState({ show: false });
      // }
      // console.log(notificationGroupedObject);
      // notificationGroupedObject["FeedbackForm"].map((feedbackNotif) => {
      //   // console.log(feedbackNotif);
      //   if (feedbackNotif.projectId !== undefined) {
      //     // getProject(feedbackNotif.projectId).then((project) => {
      //     //   console.log(project.team);
      //     // });
      //     // console.log(feedbackNotif.projectId);
      // const team = this.getProjectTeamFromState(feedbackNotif.projectId);
      //     this.setState({ team });
      //     console.log(this.state.team);
      //   }
      // });
      // }
    }
    return (
      <>
        <div className="jumbotron">
          <h2>Home</h2>
          <p className="lead">News Feed (Posts) will be here</p>
        </div>
        <ProjectRecommendation />
      </>
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);
