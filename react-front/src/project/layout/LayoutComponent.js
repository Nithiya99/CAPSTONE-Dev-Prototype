import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
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
  };
  componentDidMount() {
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
            // console.log(this.state.elements);
          } else {
            if (task.taskName === "Lets Start Working") {
              let ele = [...this.state.elements];
              ele.push({
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
              });
              this.setState({ elements: ele });
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
            }
          }
        });
      });

    //get DB connections

    getConnections(this.props.project._id).then((data) => {
      data.connections.map(async (link) => {
        // console.log(link);
        let source = {};
        let target = {};
        await this.state.elements.map((elem) => {
          if (elem.key !== undefined) {
            if (link.from.toString() === elem.key.toString()) {
              // console.log("from:");
              source = elem;
            }
            if (link.to.toString() === elem.key.toString()) {
              // console.log("to:");
              target = elem;
            }
          }
          // console.log(elem);
          return "done";
        });
        // console.log(source);
        // console.log(target);
        if (source.id !== undefined && target.id !== undefined) {
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
            ele.push(edge);
            // this.state.elements = ele;
          }
          this.setState({ elements: ele });
          // console.log(this.state.elements);
          return "done";
        }
      });
    });

    // Pert display
    // this.pertCalc();
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
      this.setState({ elements: ele });
      console.log(this.state.elements);
    }
  };
  getIdOfObjectId = (elemId) => {
    let id = {};
    // console.log(Number.isInteger(elemId));
    this.state.elements.map((elem) => {
      if (elem.data !== undefined)
        if (elem.data._id.toString() === elemId) {
          // console.log("element number:" + elem.id);
          id = elem.id;
        }
      return id;
    });
    return id;
  };
  pertCalc = () => {
    let tasksObject = {
      1: {
        id: "1",
        mostLikelyTime: 0,
        optimisticTime: 0,
        pessimisticTime: 0,
        predecessors: [],
      },
    };
    let nodes = this.state.nodes;
    // console.log();
    tasksObject = nodes.map((elem) => {
      // console.log(elem.data);
      // if (elem.data.predecessors.length === 0 || elem.data.predecessors === undefined) return;
      if (!this.state.checked) {
        elem.data.predecessors.map((predecessor, index) => {
          // console.log(predecessor);
          // let id = this.getIdOfObjectId(predecessor.toString());
          // console.log(id);
          // console.log(elem.data);
          let id = this.getIdOfObjectId(
            elem.data.predecessors[index].toString()
          );
          // console.log(elem.data.predecessors[index] + " id:" + id);
          elem.data.predecessors[index] = id;
          this.setState({ checked: true });
          // console.log(elem.data.predecessors[index] + " id:" + id);
        });
      }
      tasksObject[elem.id.toString()] = {
        id: elem.id.toString(),
        optimisticTime: elem.data.optimistic,
        mostLikelyTime: elem.data.time,
        pessimisticTime: elem.data.pessimistic,
        predecessors: elem.data.predecessors,
      };
      // console.log("Element:");
      // console.log(elem);
      // console.log(tasksObject);
      // this.getIdOfObjectId(elem.data._id);
      return tasksObject;
    });

    console.log("Pert Object:");
    console.log(tasksObject[tasksObject.length - 1]);
    console.log("Pert:");
    let pert = jsPERT(tasksObject[tasksObject.length - 1]);
    console.log(pert);
    // axios.put("http://localhost:3002/api/pertcalc", pert);
    // return nodes;
  };
  onElementClick = (event, element) => {
    // console.log(this.state.elements);
    // setSelectedNode(element.data);
    // console.log(element.data);
  };

  render() {
    if (this.state.tasks === undefined) return null;
    if (this.state.tasks.length === 0) return <div>No tasks</div>;
    return (
      <div>
        <div className="container-fluid">
          <ReactFlow
            elements={this.state.elements}
            onLoad={this.onLoad}
            style={{
              width: "100%",
              height: "95vh",
              backgroundColor: "#1A192B",
            }}
            onNodeDragStop={this.onNodeDragStop}
            onConnect={this.onConnect}
            onElementClick={this.onElementClick}
            connectionLineStyle={{ stroke: "#ddd", strokeWidth: 2 }}
            connectionLineType="bezier"
            snapToGrid={true}
            snapGrid={[16, 16]}
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
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LayoutComponent);
