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
} from "react-flow-renderer";
import {
  addTask,
  getTasks,
  putConnections,
  getConnections,
  putPredecessors,
  putPosition,
} from "../apiProject";
import jsPERT from "js-pert";
import { Button } from "@material-ui/core";
import { nodeAdded, connectionAdded } from "../../store/cpm";
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
  componentDidMount() {
    // this.setState(({ bleh }) => {
    //   if (bleh !== 2) return { bleh: bleh + 1 };
    // });
    // console.log(this.state.bleh);
    //get DB tasks
    getTasks(this.props.project._id)
      .then((data) => {
        if (data.err !== undefined) {
          if (data.err === "No tasks found") {
            this.setState({ tasks: [] });
          }
        } else {
          if (data.tasks.length > 0 && data.tasks !== undefined)
            this.setState({ tasks: data.tasks });
        }
      })
      .then(() => {
        if (!this.state.tasks || this.state.tasks[0] === "") return null;
        this.state.tasks.map((task) => {
          // label: "Bleh",
          // description: "Bleh max",
          // time: 2,
          // pessimistic: 3,
          // optimistic: 1,
          // predecessors: ["1", "2"],
          task["label"] = task.taskName;
          task["description"] = task.description;
          task["time"] = task.mostLikelyTime;
          task["optimistic"] = task.optimisticTime;
          task["pessimistic"] = task.pessimisticTime;
          // console.log(task);
          if (
            task.taskName !== "Completed!!" &&
            task.taskName !== "Lets Start Working"
          ) {
            let ele = [...this.state.elements];
            // console.log(ele);
            let newNode = {
              key: task._id,
              id: (ele.length + 1).toString(),
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
            ele.push(newNode);
            this.setState({ elements: ele });
            let newNodes = [...this.state.nodes];
            newNodes.push(newNode);
            this.setState({ nodes: newNodes });
            this.props.nodeAdded({ node: newNode });
            // console.log(this.state.elements);
          } else {
            if (task.taskName === "Lets Start Working") {
              let ele = [...this.state.elements];
              let newNode = {
                key: task._id,
                id: "1",
                type: "input",
                data: {
                  label: "Lets Start Working",
                  description:
                    "Start working on tasks to complete project on time",
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
              ele.push(newNode);
              this.setState({ elements: ele });
              this.props.nodeAdded({ node: newNode });
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
                  task.position !== undefined
                    ? task.position
                    : { x: 500, y: 0 },
              };
              ele.push(newNode);
              this.setState({ elements: ele });
              let newNodes = [...this.state.nodes];
              newNodes.push(newNode);
              this.setState({ nodes: newNodes });
              this.props.nodeAdded({ node: newNode });
            }
          }
        });
      })
      .then(() => {
        getConnections(this.props.project._id).then((data) => {
          // this.state.elements.map((elem) => console.log(elem));
          // console.log(this.state.elements);

          data.connections.map((link) => {
            // console.log(link);
            this.state.elements.map((elem) => {
              if (elem.key !== undefined) {
                if (link.from.toString() === elem.key.toString()) {
                  // console.log("from:", elem);
                  this.setState({ source: elem });
                }
                if (link.to.toString() === elem.key.toString()) {
                  // console.log("to:", elem);
                  this.setState({ target: elem });
                }
              }
              // console.log(getSource(link));
              // console.log(elem);
              // this.getSource(link);
            });
            let source = this.state.source;
            let target = this.state.target;
            // console.log(source);
            // console.log(target);
            // console.log(source, target);
            // if (source.id !== undefined && target.id !== undefined) {
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
            };
            let ele = [...this.state.elements];
            if (!this.edgeInElements(ele, edge)) {
              this.props.connectionAdded({ connection: edge });
              ele.push(edge);
              // this.state.elements = ele;
              this.setState({ elements: ele });
              // console.log(this.state.elements);
            }

            return "done";
            // }
          });
        });

        // Pert display
        // this.pertCalc();
      });

    //get DB connections
  }
  onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
  };
  onNodeDragStop = (e, node) => {
    console.log(node.position, node.data._id);
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
    // postEdges(params);
    // props.connectNodes(parseInt(params.source), parseInt(params.target));
    // console.log(params.source, params.target);
    // props.updateEdges();
    // let predecessorArr = [];
    // await getPredecessors(parseInt(params.target), params.source.toString())
    //   .then((val) => (predecessorArr = val))
    //   .catch((err) => console.log(err));
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
      console.log(this.state.elements);
      let sourceId = "";
      let targetId = "";
      this.state.elements.map((elem) => {
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
      let ele = [...this.state.elements];
      if (!this.edgeInElements(ele, edge)) {
        ele.push(edge);
        putConnections(this.props.project._id, sourceId, targetId).then(() => {
          console.log("connection " + sourceId + "to " + targetId + "added");
        });
        // this.state.elements = ele;
      }
      this.props.connectionAdded(edge);
      this.setState({ elements: ele });
      console.log(this.state.elements);
    }
  };
  getIdOfObjectId = (elemId) => {
    let id = {};
    // console.log(Number.isInteger(elemId));
    id = this.state.elements.map((elem) => {
      if (elem.data !== undefined)
        if (elem.data._id.toString() === elemId) {
          // console.log("element number:" + elem.id);
          id = elem.id;
        }
      return id;
    });
    return id[id.length - 1];
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  pertCalc = () => {
    this.setState({ show: true });
    let tasksObject = {
      1: {
        id: "1",
        mostLikelyTime: 0,
        optimisticTime: 0,
        pessimisticTime: 0,
        predecessors: [],
      },
    };
    let nodes = this.state.nodes.map((elem) => ({
      ...elem,
    }));
    // console.log();
    nodes.map((elem) => {
      if (
        elem.data.predecessors.length === 0 ||
        elem.data.predecessors === undefined
      )
        return;
      elem.data.predecessors.map((pre, index) => {
        let id = this.getIdOfObjectId(pre.toString());
        let predecessors = [...elem.data.predecessors];
        predecessors[index] = id.toString();
        elem.data = { ...elem.data, predecessors };
        // console.log(elem.data);
        // console.log(elem.data);
      });
    });
    // console.log(nodes);
    tasksObject = nodes.map((elem) => {
      if (
        elem.data.predecessors.length === 0 ||
        elem.data.predecessors === undefined
      )
        return;

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
    let pert = jsPERT(tasksObjectFinal);
    this.setState({ pert });
    console.log(pert);
  };
  onElementClick = (event, element) => {
    // console.log(this.state.elements);
    // setSelectedNode(element.data);
    // console.log(element.data);
    console.log(element);
  };

  render() {
    if (this.state.tasks === undefined) return null;
    if (this.state.tasks.length === 0) return <div>No tasks</div>;
    const { nodes, connections } = this.props;
    const { status } = this.props.project;
    let connect = status === "Completed" ? false : true;

    let elements = [...nodes, ...connections];
    // console.log(elements, this.state.elements);
    return (
      <div>
        <div className="container-fluid">
          <ReactFlow
            elements={this.state.elements}
            onLoad={this.onLoad}
            style={{
              width: "100%",
              height: "65vh",
              backgroundColor: "#1A192B",
            }}
            onNodeDragStop={this.onNodeDragStop}
            onConnect={this.onConnect}
            onElementClick={this.onElementClick}
            connectionLineStyle={{ stroke: "#ddd", strokeWidth: 2 }}
            connectionLineType="bezier"
            snapToGrid={true}
            snapGrid={[16, 16]}
            nodesConnectable={connect}
            nodesDraggable={connect}
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
          <Button
            onClick={() => {
              this.pertCalc();
            }}
          >
            Pert
          </Button>
          {/*<Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>
                <center>
                  <strong>
                    <u>PERT OBJECTS</u>
                  </strong>
                </center>
              </h5>
              <Task tasks={this.state.task} />
              <h5>
                <center>
                  <strong>
                    <u>PERT</u>
                  </strong>
                </center>
              </h5>
              {/* <Pert pert={this.state.pert} /> */}
          {/* {console.log(this.state.pert)} */}
          {/* </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>*/}{" "}
          */}
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
});

const mapDispatchToProps = (dispatch) => ({
  nodeAdded: (params) => dispatch(nodeAdded(params)),
  connectionAdded: (params) => dispatch(connectionAdded(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LayoutComponent));
