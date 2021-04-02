import React, { Component } from "react";
import { listmytasks } from "../apiProject";
import { getCurrentUser } from "./../../user/apiUser";
import { updateTask } from "./../apiProject";
import Board from "react-trello";

var data = {};
var projleader = "";
var tasks = [];
let flag = false,
  flag1 = false;
const handleDragStart = (cardId, laneId) => {
  console.log("drag started");
  // console.log(`cardId: ${cardId}`)
  // console.log(tasks)
  flag1 = false;
  if (tasks === {}) return;
  tasks.forEach((task) => {
    // console.log(task.id , cardId);
    // console.log(task);
    if (task.id === cardId) {
      // console.log(getCurrentUser()._id)
      task.assigned.forEach((user) => {
        // console.log(user)
        if (user === getCurrentUser()._id) flag1 = true;
      });
    }
  });
  // console.log(`laneId: ${laneId}`)
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log("drag ended");

  if (
    projleader === getCurrentUser()._id &&
    sourceLaneId === "Review" &&
    targetLaneId === "COMPLETED"
  )
    flag1 = true;

  if (projleader === getCurrentUser()._id && sourceLaneId === "COMPLETED")
    flag1 = true;
  // console.log(`cardId: ${cardId}`)
  // console.log(`sourceLaneId: ${sourceLaneId}`)
  // console.log(`targetLaneId: ${targetLaneId}`)
  if (flag1 === false) {
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
  };
  setEventBus = (eventBus) => {
    this.setState({ eventBus });
  };

  async componentDidMount() {
    await listmytasks().then((data) => {
      let allproj = data.userProjects;
      allproj.forEach((proj) => {
        if (proj._id === this.props.projectId) {
          projleader = proj.leader;
          this.setState({
            mytasks: proj.tasks,
          });
          // console.log(this.state.mytasks)
        }
      });
    });

    const mytasks = this.state.mytasks;
    if (getCurrentUser()._id === projleader) flag = true;

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
      // console.log(task.assignedTo);
      // console.log(getCurrentUser()._id);
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
          cards: cards_planned,
          style: {
            backgroundColor: "#3179ba",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 180,
          },
        },
        {
          id: "WIP",
          title: "Work In Progress",
          label: "2/4",
          cards: cards_wip,
          style: {
            backgroundColor: "#FFCC33",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 190,
          },
        },
        {
          id: "Review",
          title: "Review",
          label: "3/4",
          cards: cards_review,
          style: {
            backgroundColor: "#FF9900",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 180,
          },
        },
        {
          id: "COMPLETED",
          title: "Completed",
          label: "4/4",
          droppable: flag,
          cards: cards_completed,
          style: {
            backgroundColor: "#00CC00",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.75)",
            color: "#fff",
            width: 180,
          },
        },
      ],
    };
    // console.log(data)
    this.setState({ boardData: data });
  }

  shouldReceiveNewData = (nextData) => {
    // console.log(nextData)
    let cards = [];
    nextData.lanes.forEach((data) => {
      data.cards.forEach((card) => {
        if (flag1 === true) card.status = card.laneId;
        else card.laneId = card.status;
        cards.push(card);
      });
    });
    tasks = cards;
    cards.forEach((card) => {
      updateTask(card, this.props.projectId).then((data) => console.log(data));
    });

    this.setState({ mytasks: cards });
  };

  render() {
    // console.log(this.props.proj);
    // console.log(mytasks);
    flag = false;
    flag1 = false;
    return (
      <div>
        <div>
          <h3>Task List</h3>
        </div>
        <div>
          <Board
            // editable
            // editLaneTitle
            data={this.state.boardData}
            // draggable
            onDataChange={this.shouldReceiveNewData}
            eventBusHandle={this.setEventBus}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            style={{
              backgroundColor: "#eee",
            }}
            cardStyle={{
              minWidth: 140,
              width: 140,
              maxWidth: 140,
              marginLeft: 55,
              overflow: "hidden",
            }}
          />
        </div>
      </div>
    );
  }
}

export default TrelloTask;
