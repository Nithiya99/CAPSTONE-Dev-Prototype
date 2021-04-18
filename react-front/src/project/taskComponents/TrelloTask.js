import React, { Component } from "react";
import { listmytasks } from "../apiProject";
import { getCurrentUser } from "./../../user/apiUser";
import { updateTask } from "./../apiProject";
import Board from "react-trello";
import { deleteTask, getTasks } from "../apiProject";
import { connect } from "react-redux";
import { updateTasks } from "./../../store/tasks";
import { toast, ToastContainer } from "react-toastify";

let data = {};
let projleader = "";
let tasks = [];
let flag = false;
let projectId = "";

const handleDragStart = (cardId, laneId) => {
  console.log("drag started");
  flag = false;
  if (tasks === {}) return;
  tasks.forEach((task) => {
    if (task.id === cardId) {
      // console.log(getCurrentUser()._id)
      task.assigned.forEach((user) => {
        // console.log(user)
        if (user === getCurrentUser()._id) flag = true;
      });
    }
  });
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log("drag ended");

  if (
    projleader === getCurrentUser()._id &&
    sourceLaneId === "Review" &&
    targetLaneId === "COMPLETED"
  )
    flag = true;

  if (projleader === getCurrentUser()._id && sourceLaneId === "COMPLETED")
    flag = true;

  if (flag === false) {
    alert(
      "Sry.. You are not allowed to do this operation.. Changes made will be resetted"
    );
    window.location.reload(false);
  }
};

class TrelloTask extends Component {
  state = {
    mytasks: [],
    boardData: { lanes: [] },
    editable: true,
    isleader: false,
  };
  setEventBus = (eventBus) => {
    this.setState({ eventBus });
  };

  onCardDelete = async (cardId, laneId) => {
    if (projleader === getCurrentUser()._id) {
      let response = window.confirm("Are you Sure?");
      if (response) {
        await deleteTask(cardId, projectId);
        await getTasks(projectId).then((data) => {
          this.props.updateTasks({ tasks: data.tasks });
          // console.log(data);
        });
        // this.updateBoard();
      } else {
        // toast.error("Gimme a second...", {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
        window.location.reload();
      }
    } else {
      toast.warning(
        "You are not allowed to delete tasks.. Your action will be reverted.."
      );
    }
  };
  async componentDidMount() {
    projectId = this.props.projectId;
    if (this.props.status === "Completed") {
      this.setState({
        editable: false,
      });
    }

    await listmytasks().then((data) => {
      let allproj = data.userProjects;
      allproj.forEach((proj) => {
        if (proj._id === this.props.projectId) {
          projleader = proj.leader;
          // this.setState({
          //   mytasks: proj.tasks,
          // });
          // console.log(this.state.mytasks)
        }
      });
    });
    getTasks(this.props.projectId).then((val) => {
      val.tasks.shift();
      val.tasks.shift();
      this.setState({ mytasks: val.tasks });
      this.updateBoard();
    });
    if (getCurrentUser()._id === projleader)
      this.setState({
        isleader: true,
      });
  }
  updateBoard = () => {
    const mytasks = this.state.mytasks;
    // console.log(mytasks);
    // console.log("mytasks:" + mytasks);
    let cards_planned = [];
    let cards_wip = [];
    let cards_review = [];
    let cards_completed = [];
    mytasks.forEach((task) => {
      var card = {
        id: task._id,
        title: task.taskName,
        label: task.mostLikelyTime + " days",
        description: task.taskDescription,
        pessimisticTime: task.pessimisticTime,
        optimisticTime: task.optimisticTime,
        assigned: task.assignedTo,
        desc: task.taskDescription,
        mostLikelyTime: task.mostLikelyTime,
        status: task.status,
      };
      if (task.status === "PLANNED") cards_planned.push(card);
      else if (task.status === "WIP") cards_wip.push(card);
      else if (task.status === "Review") cards_review.push(card);
      else if (task.status === "COMPLETED") cards_completed.push(card);
    });
    data = {
      lanes: [
        {
          id: "PLANNED",
          title: "Todo Tasks",
          label: "1/4",
          droppable: this.state.editable,
          cards: cards_planned,
          style: {
            backgroundColor: "#3179ba",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 260,
          },
        },
        {
          id: "WIP",
          title: "Work In Progress",
          label: "2/4",
          droppable: this.state.editable,
          cards: cards_wip,
          style: {
            backgroundColor: "#FFCC33",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 260,
          },
        },
        {
          id: "Review",
          title: "Review",
          label: "3/4",
          droppable: this.state.editable,
          cards: cards_review,
          style: {
            backgroundColor: "#FF9900",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 260,
          },
        },
        {
          id: "COMPLETED",
          title: "Completed",
          label: "4/4",
          droppable: this.state.editable && this.state.isleader,
          cards: cards_completed,
          style: {
            backgroundColor: "#00CC00",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 260,
          },
        },
      ],
    };
    this.setState({ boardData: data });
  };
  shouldReceiveNewData = (nextData) => {
    let cards = [];
    nextData.lanes.forEach((data) => {
      data.cards.forEach((card) => {
        if (flag === true) card.status = card.laneId;
        else card.laneId = card.status;
        cards.push(card);
      });
    });
    tasks = cards;
    cards.forEach((card) => {
      updateTask(card, this.props.projectId);
    });
    this.setState({ mytasks: cards });
  };
  // componentWillReceiveProps() {
  //   if (
  //     this.state.mytasks.length < this.props.tasks.length &&
  //     this.state.mytasks.length !== this.props.tasks.length
  //   ) {
  //     this.setState({ mytasks: this.props.tasks });
  //     console.log("new Tasks:", this.state.tasks);
  //     // this.updateBoard();
  //   }
  // }
  componentDidUpdate(prevProps, prevState) {
    const tasks = [...this.props.tasks];
    tasks.shift();
    tasks.shift();
    if (prevState.mytasks.length !== tasks.length) {
      this.setState({ mytasks: tasks });
      this.updateBoard();
    }
    // console.log(prevState.mytasks.length, tasks.length);
  }
  render() {
    // console.log(this.state.mytasks);
    flag = false;
    return (
      <div>
        <ToastContainer />
        <div>
          <h3>Task List</h3>
        </div>
        <div>
          <Board
            // editable
            // editLaneTitle
            data={this.state.boardData}
            onDataChange={this.shouldReceiveNewData}
            eventBusHandle={this.setEventBus}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            onCardDelete={this.onCardDelete}
            style={{
              backgroundColor: "#eee",
            }}
            cardStyle={{
              minWidth: 250,
              width: 250,
              maxWidth: 250,
              overflow: "hidden",
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
});

const mapDispatchToProps = (dispatch) => ({
  updateTasks: (params) => dispatch(updateTasks(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrelloTask);
