import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Pert from "./Pert";
import Task from "./Task";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  removeElements,
} from "react-flow-renderer";
import {
  addTask,
  getTasks,
  putConnections,
  deleteConnections,
  getConnections,
  putPredecessors,
  putPosition,
  putExpectedTime,
} from "../apiProject";
import jsPERT from "js-pert";
import { Button } from "@material-ui/core";
import {
  nodeAdded,
  connectionAdded,
  replaceNodes,
  replaceConnections,
  replaceElements,
  setPert,
  setExpectedTime,
  setSlacks,
  setCriticalPath,
} from "../../store/cpm";
import { updateTasks } from "../../store/tasks";
import { getCurrentUser } from "./../../user/apiUser";
const styles = (theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 3, 3),
  },
});
class LayoutComponent extends Component {
  state = {
    elements: [],
    tasks: [],
    nodes: [],
    pert: {},
    task: {},
    show: false,
    checked: false,
    bleh: 1,
  };

  onElementsRemove = (elementsToRemove) => {
    if (this.props.project.leader.toString() === getCurrentUser()._id) {
      let cons = this.props.connections;
      const filteredConnections = cons.filter(
        (con) => con.id !== elementsToRemove[0].id
      );
      this.props.replaceConnections({ connections: filteredConnections });
      cons.map((con) => {
        if (con.id === elementsToRemove[0].id) {
          // console.log(con.id, elementsToRemove[0].id);
          deleteConnections(this.props.project._id, con._id).then((data) => {
            console.log("connection deleted");
            // this.pertCalc();
          });
          return;
        }
      });
    }
  };
  onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
  };
  onNodeDragStop = (e, node) => {
    // console.log(node.position, node.data._id);
    putPosition(this.props.project._id, node.data._id, node.position).then(
      () => {
        console.log(node.position + " is saved");
      }
    );
  };
  edgeInElements(elements, edge) {
    let inside = false;
    elements.map((elem) => {
      if (elem.id.toString() === edge.id.toString()) {
        inside = true;
      }
      return "done";
    });
    return inside;
  }
  onConnect = (params) => {
    if (this.props.project.leader.toString() === getCurrentUser()._id) {
      let source = params.source;
      let target = params.target;
      if (source !== undefined && target !== undefined) {
        let edge = {
          id:
            "reactflow__edge-" +
            source.toString() +
            "null-" +
            target.toString() +
            "null",
          source: source.toString(),
          sourceHandle: null,
          target: target.toString(),
          targetHandle: null,
        };
        // console.log(this.state.elements);
        let sourceId = "";
        let targetId = "";
        // console.log(this.props.nodes);
        this.props.nodes.map((elem) => {
          if (elem.id === source) {
            sourceId = elem.key;
          }
          if (elem.id === target) {
            targetId = elem.key;
          }
        });
        putPredecessors(this.props.project._id, targetId, sourceId).then(() => {
          console.log(sourceId + " has new Predecessor " + targetId);
        });
        // let ele = [...this.state.elements];
        // if (!this.edgeInElements(ele, edge)) {
        //   ele.push(edge);
        putConnections(this.props.project._id, sourceId, targetId).then(() => {
          console.log("connection " + sourceId + "to " + targetId + "added");
        });
        // }
        this.props.connectionAdded({ connection: edge });
        // this.setState({ elements: ele });
        // console.log(this.state.elements);
        this.pertCalc();
      }
    }
  };
  getIdOfObjectId = (elemId) => {
    let id = {};
    const { nodes } = this.props;
    id = nodes.map((elem) => {
      if (elem.data !== undefined)
        if (elem.data._id.toString() === elemId) {
          id = elem.id;
        }
      return id;
    });
    return id[id.length - 1];
  };
  // handleClose = () => {
  //   this.setState({ show: false });
  // };
  pertCalc = () => {
    // this.setState({ show: true });
    // console.log("inside pertCalc:", tasksObject);
    let nodes = this.props.nodes.map((elem) => ({
      ...elem,
    }));
    // let connections = this.props.connections.map((elem) => ({
    //   ...elem,
    // }));
    // console.log(connections);
    // let { connections } = this.props;
    // console.log("props:", this.props.connections);
    // console.log("connections:");
    let ids = [];
    this.props.connections.map((connection) => {
      // console.log(connection.source, connection.target);
      if (!ids.includes(connection.source)) {
        ids.push(connection.source.toString());
      }
      if (!ids.includes(connection.target)) {
        ids.push(connection.target.toString());
      }
    });
    // console.log("nodes:");
    let newNodes = [];
    nodes.map((node) => {
      if (ids.includes(node.id)) newNodes.push(node);
    });

    let tasksObject = ids.includes("1")
      ? {
          1: {
            id: "1",
            mostLikelyTime: 0,
            optimisticTime: 0,
            pessimisticTime: 0,
            predecessors: [],
          },
        }
      : {};
    // console.log("TasksObject before node addition:", tasksObject);
    // console.log(ids);
    // console.log("nodes sent for pertcalc:", newNodes);
    newNodes.map((elem) => {
      if (
        elem.data.predecessors.length === 0 ||
        elem.data.predecessors === undefined
      )
        return;
      elem.data.predecessors.map((pre, index) => {
        let id = this.getIdOfObjectId(pre.toString());
        // console.log(id);
        let predecessors = [...elem.data.predecessors];
        predecessors[index] = id.toString();
        elem.data = { ...elem.data, predecessors };
      });
    });
    // console.log(nodes);
    tasksObject = newNodes.map((elem) => {
      // console.log("tasksObject node:", elem);
      tasksObject[elem.id.toString()] = {
        id: elem.id.toString(),
        optimisticTime: elem.data.optimistic,
        mostLikelyTime: elem.data.time,
        pessimisticTime: elem.data.pessimistic,
        predecessors: elem.data.predecessors,
      };
      return tasksObject;
    });
    let tasksObjectFinal = tasksObject[tasksObject.length - 1];
    console.log("TasksObject:");
    console.log(tasksObjectFinal);
    console.log("Pert:");
    let pert = {};
    // console.log("gonna set pert");
    try {
      // if (tasksObject[1] !== undefined) {
      // console.log(tasksObject[1]);
      pert = jsPERT(tasksObjectFinal);
      this.props.setPert({ pert });
      console.log(this.props.pert);
      // this.props.setSlacks({ slackObject: this.props.pert.slack });
      // console.log("slacks:");
      let slackObject = {};
      slackObject = newNodes.map((elem, index) => {
        // console.log(elem.id, pert.slack[elem.id]);
        if (index !== 0 && index !== 1) {
          // console.log("Slack elem:", elem);
          let created = elem.data.created;
          let today = new Date();
          let day1 = new Date(today.toUTCString());
          let day2 = new Date(created);
          let difference = Math.abs(day2 - day1);
          let days = parseInt(difference / (1000 * 3600 * 24));
          // console.log(elem.data.label + " " + days + " " + pert.slack[elem.id]);
          slackObject[elem.data.label] = {
            slack: pert.slack[elem.id],
            days,
            overdue: pert.slack[elem.id] < days ? true : false,
          };
          return slackObject;
        }
      });
      console.log("slacks Object:", slackObject[slackObject.length - 1]);
      let obj = slackObject[slackObject.length - 1];
      this.props.setSlacks({ slackObject: obj });
      let newNodesObject = {};
      newNodesObject = newNodes.map((node) => {
        newNodesObject[node.id] = node.data;
        return newNodesObject;
      });
      newNodesObject = newNodesObject[newNodesObject.length - 1];
      // console.log("newNodesObject:", newNodesObject);
      let criticalPathData = {};
      criticalPathData = pert.criticalPath.map((id) => {
        criticalPathData[id] = newNodesObject[id];
        return criticalPathData;
      });
      criticalPathData = criticalPathData[criticalPathData.length - 1];
      console.log("criticalPathDataObject:", criticalPathData);
      this.props.setCriticalPath({ criticalPath: criticalPathData });

      this.props.setExpectedTime({
        expectedTime: Math.floor(this.props.pert.latestFinishTimes.__end),
      });
      putExpectedTime(
        this.props.project._id,
        Math.floor(this.props.pert.latestFinishTimes.__end)
      );
      // }
    } catch (err) {
      // console.log(err);
      this.props.setPert({ pert: {} });
      // console.log(this.props.pert);
      this.props.setExpectedTime({
        expectedTime: 0,
      });
      putExpectedTime(this.props.project._id, 0);
    }
    // this.setState({ pert });
  };
  onElementClick = (event, element) => {
    console.log(element);
  };
  componentDidMount() {
    let newNodes = [];

    getTasks(this.props.project._id).then((data) => {
      // console.log(data.tasks);
      const tasks = data.tasks;
      let newTasks = [];
      tasks.map((task) => {
        newTasks.push({ ...task });
      });
      newTasks.map((task) => {
        task["label"] = task.taskName;
        task["description"] = task.description;
        task["time"] = task.mostLikelyTime;
        task["optimistic"] = task.optimisticTime;
        task["pessimistic"] = task.pessimisticTime;
        if (
          task.taskName !== "Completed!!" &&
          task.taskName !== "Lets Start Working"
        ) {
          let newNode = {
            key: task._id,
            id: (newNodes.length + 1).toString(),
            data: task,
            sourcePosition: "right",
            targetPosition: "left",
            position:
              task.position !== undefined
                ? task.position
                : {
                    x: (Math.random() * window.innerWidth) / 2,
                    y: (Math.random() * window.innerHeight) / 2,
                  },
          };
          newNodes.push(newNode);
        }
        if (task.taskName === "Lets Start Working") {
          let ele = [...this.state.elements];
          let newNode = {
            key: task._id,
            id: "1",
            type: "input",
            data: {
              label: "Lets Start Working",
              description: "Start working on tasks to complete project on time",
              pessimistic: 0,
              time: 0,
              optimistic: 0,
              predecessors: [],
              _id: task._id,
            },
            sourcePosition: "right",
            position:
              task.position !== undefined ? task.position : { x: 0, y: 0 },
          };
          newNodes.push(newNode);
        }
        if (task.taskName === "Completed!!") {
          let ele = [...this.state.elements];
          let newNode = {
            key: task._id,
            id: "2",
            type: "output",
            data: {
              label: "Completed!!",
              description: "Yaaayy you gus have completed the project",
              pessimistic: 0,
              time: 0,
              optimistic: 0,
              predecessors: task.predecessors,
              _id: task._id,
            },
            targetPosition: "left",
            position:
              task.position !== undefined ? task.position : { x: 500, y: 0 },
          };
          newNodes.push(newNode);
        }
      });
      this.props.replaceNodes({ nodes: newNodes });
      // console.log("Mount nodes:", this.props.nodes);
    });
    getConnections(this.props.project._id)
      .then((data) => {
        let connections = [];
        data.connections.map((link) => {
          newNodes.map((elem) => {
            if (elem.key !== undefined) {
              if (link.from.toString() === elem.key.toString()) {
                this.setState({ source: elem });
              }
              if (link.to.toString() === elem.key.toString()) {
                this.setState({ target: elem });
              }
            }
          });
          let source = this.state.source;
          let target = this.state.target;
          if (source !== undefined && target !== undefined) {
            let edge = {
              id:
                "reactflow__edge-" +
                source.id.toString() +
                "null-" +
                target.id.toString() +
                "null",
              source: source.id.toString(),
              sourceHandle: null,
              target: target.id.toString(),
              targetHandle: null,
              _id: link._id,
            };
            connections.push(edge);
          }
          return "done";
        });
        // console.log(connections);
        this.props.replaceConnections({ connections: connections });
      })
      .then(() => {
        this.pertCalc();
      });
  }
  componentDidUpdate(prevState, prevProps) {
    if (this.props.connections.length !== prevState.connections.length) {
      this.pertCalc();
      // console.log(prevState.connections.length, this.props.connections.length);
      // console.log("Pert from comp update:", this.props.pert);
      // console.log("Pert calculation nodes:", this.props.nodes);
    }
    if (prevState.tasks.length !== this.props.tasks.length) {
      const { tasks } = this.props;
      let newTasks = [];
      tasks.map((task) => {
        newTasks.push({ ...task });
      });
      let newNodes = [];
      newTasks.map((task) => {
        task["label"] = task.taskName;
        task["description"] = task.description;
        task["time"] = task.mostLikelyTime;
        task["optimistic"] = task.optimisticTime;
        task["pessimistic"] = task.pessimisticTime;
        if (
          task.taskName !== "Completed!!" &&
          task.taskName !== "Lets Start Working"
        ) {
          let newNode = {
            key: task._id,
            id: (newNodes.length + 1).toString(),
            data: task,
            sourcePosition: "right",
            targetPosition: "left",
            position:
              task.position !== undefined
                ? task.position
                : {
                    x: (Math.random() * window.innerWidth) / 2,
                    y: (Math.random() * window.innerHeight) / 2,
                  },
          };
          newNodes.push(newNode);
        }
        if (task.taskName === "Lets Start Working") {
          let ele = [...this.state.elements];
          let newNode = {
            key: task._id,
            id: "1",
            type: "input",
            data: {
              label: "Lets Start Working",
              description: "Start working on tasks to complete project on time",
              pessimistic: 0,
              time: 0,
              optimistic: 0,
              predecessors: [],
              _id: task._id,
            },
            sourcePosition: "right",
            position:
              task.position !== undefined ? task.position : { x: 0, y: 0 },
          };
          newNodes.push(newNode);
        }
        if (task.taskName === "Completed!!") {
          let ele = [...this.state.elements];
          let newNode = {
            key: task._id,
            id: "2",
            type: "output",
            data: {
              label: "Completed!!",
              description: "Yaaayy you gus have completed the project",
              pessimistic: 0,
              time: 0,
              optimistic: 0,
              predecessors: task.predecessors,
              _id: task._id,
            },
            targetPosition: "left",
            position:
              task.position !== undefined ? task.position : { x: 500, y: 0 },
          };
          newNodes.push(newNode);
        }
      });
      this.props.replaceNodes({ nodes: newNodes });
      if (this.props.connections.length === 0) {
        getConnections(this.props.project._id)
          .then((data) => {
            let connections = [];
            data.connections.map((link) => {
              newNodes.map((elem) => {
                if (elem.key !== undefined) {
                  if (link.from.toString() === elem.key.toString()) {
                    this.setState({ source: elem });
                  }
                  if (link.to.toString() === elem.key.toString()) {
                    this.setState({ target: elem });
                  }
                }
              });
              let source = this.state.source;
              let target = this.state.target;
              let edge = {
                id:
                  "reactflow__edge-" +
                  source.id.toString() +
                  "null-" +
                  target.id.toString() +
                  "null",
                source: source.id.toString(),
                sourceHandle: null,
                target: target.id.toString(),
                targetHandle: null,
                _id: link._id,
              };
              connections.push(edge);

              return "done";
            });
            // console.log(connections);
            this.props.replaceConnections({ connections: connections });
          })
          .then(() => {
            this.pertCalc();
          });
      }
    }
  }
  render() {
    if (this.props.tasks.length === 0) return <div>No tasks</div>;
    const { nodes, connections, tasks } = this.props;
    const { status } = this.props.project;
    let connectCheck = status === "Completed" ? false : true;
    const elements = [];
    nodes.map((node) => {
      elements.push({ ...node });
    });
    connections.map((connection) => {
      elements.push({ ...connection });
    });
    // console.log("nodes:", nodes);
    return (
      <div>
        <div className="container-fluid">
          <ReactFlow
            elements={elements}
            onLoad={this.onLoad}
            style={{
              width: "100%",
              height: "65vh",
              backgroundColor: "#1A192B",
            }}
            onNodeDragStop={this.onNodeDragStop}
            onConnect={this.onConnect}
            onElementClick={this.onElementClick}
            onElementsRemove={this.onElementsRemove}
            connectionLineStyle={{ stroke: "#ddd", strokeWidth: 2 }}
            connectionLineType="bezier"
            snapToGrid={true}
            snapGrid={[16, 16]}
            nodesConnectable={connectCheck}
            nodesDraggable={connectCheck}
            defaultZoom={1}
          >
            <Background color="#888" gap={16} />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === "input") return "#DC143C";
                if (n.type === "output") return "#90ee90";
                return "cyan";
              }}
            />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  nodes: state.cpm.nodes,
  connections: state.cpm.connections,
  state: state,
  notifications: state.notifications.notifications,
  tasks: state.tasks.tasks,
  elements: state.cpm.elements,
  pert: state.cpm.pert,
  slacks: state.cpm.slacks,
  criticalPath: state.cpm.criticalPath,
});

const mapDispatchToProps = (dispatch) => ({
  nodeAdded: (params) => dispatch(nodeAdded(params)),
  connectionAdded: (params) => dispatch(connectionAdded(params)),
  updateTasks: (params) => dispatch(updateTasks(params)),
  replaceNodes: (params) => dispatch(replaceNodes(params)),
  replaceConnections: (params) => dispatch(replaceConnections(params)),
  replaceElements: (params) => dispatch(replaceElements(params)),
  setPert: (params) => dispatch(setPert(params)),
  setExpectedTime: (params) => dispatch(setExpectedTime(params)),
  setSlacks: (params) => dispatch(setSlacks(params)),
  setCriticalPath: (params) => dispatch(setCriticalPath(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LayoutComponent));
