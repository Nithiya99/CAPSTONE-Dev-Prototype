import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  getCurrentUser,
  getfriends,
  getUserById,
  updatePersonalChat,
} from "./apiUser";
import io from "socket.io-client";
import DefaultProfile from "./../images/avatar.png";
import TextField from "@material-ui/core/TextField";
import { Accordion, Card, Button, Row, Tab, Col, Nav } from "react-bootstrap";
import SendIcon from "@material-ui/icons/Send";

var options = {
  rememberUpgrade: true,
  transports: ["websocket"],
  secure: true,
  rejectUnauthorized: false,
};

const MyChats = () => {
  const [users, setUsers] = useState([]);
  const [touser, settouser] = useState();
  const [toname, settoname] = useState();
  const [comp, setcomp] = useState([]);
  const [state, setState] = useState({
    message: "",
    from_name: getCurrentUser().name,
    created: new Date(),
  });
  const [chat, setChat] = useState([]);

  const divRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    let userid = getCurrentUser()._id;
    socketRef.current = io.connect("http://localhost:8081", options);
    socketRef.current.emit("getPersonalChat", {
      userid,
      client_chat_length: chat.length,
    });
    socketRef.current.on("personalchat" + userid, (data) => {
      setChat(data);
      console.log(data);
    });
  });

  useEffect(async () => {
    await getfriends(getCurrentUser()._id).then(async (data) => {
      let users = [];
      await data.map(async (user) => {
        users = await getUserById(user).then((u) => {
          users.push(u.user);
          return users;
        });
        setUsers(users);
        console.log(users);
        let comp = [];
        comp = users.map((user, i) => {
          comp.push(
            <Nav.Item>
              <Nav.Link eventKey={i}>
                <div className="d-flex align-items-center">
                  <div className="mr-3">
                    <img src={DefaultProfile} style={{ width: "40px" }} />
                  </div>
                  <div>{user.name}</div>
                </div>
              </Nav.Link>
            </Nav.Item>
          );
          return comp;
        });
        setcomp(comp[comp.length - 1]);
        console.log(comp);
      });
    });
  }, []);

  const onMessageSubmit = (e) => {
    const { from_name, message, created } = state;
    let fromuser = getCurrentUser()._id;
    if (message.trim() !== "") {
      socketRef.current.emit("personalchat", {
        from_name,
        toname,
        message,
        created,
        touser,
        fromuser,
      });
      let chat_msg = { from_name, toname, message, created, touser, fromuser };
      updatePersonalChat(chat_msg).then((data) => {
        console.log(data);
      });
    }
    e.preventDefault();
    setState({ message: "", from_name });
  };

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const setChatView = (user) => {
    console.log(user);
    settouser(user._id);
    settoname(user.name);
    console.log(user);
  };
  // onLoad={setChatView(user)}
  return (
    <div className="pt-5">
      <Tab.Container id="left-tabs-example" defaultActiveKey="empty">
        <Row>
          <Col sm={2}>
            <div className="card card-custom card-stretch">
              <div className="card-body pt-4">
                <Nav variant="pills" className="flex-column mt-3">
                  {comp.map((data) => data)}
                </Nav>
              </div>
            </div>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="empty">
                <div className="card card-stretch">
                  <div className="card-header">
                    <div className="card-title align-items-start flex-column">
                      <h4 className="card-label font-weight-bolder text-dark">
                        Click on a chat.
                      </h4>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              {users.map((user, i) => {
                let comp = [];
                comp.push(
                  <Tab.Pane eventKey={i}>
                    <div className="card card-stretch">
                      <div className="card-header">
                        <div className="card-title align-items-start flex-column">
                          <h4 className="card-label font-weight-bolder text-dark">
                            {user.name}
                          </h4>
                        </div>
                      </div>
                      <div className="card-body">
                        <div>
                          <div ref={divRef} className="render-chat">
                            <div ref={messagesEndRef} />
                          </div>
                          <form onSubmit={onMessageSubmit}>
                            <div className="row pt-5">
                              <Col sm={10}>
                                <TextField
                                  name="message"
                                  onChange={(e) => {
                                    onTextChange(e);
                                  }}
                                  value={state.message}
                                  id="outlined-multiline-static"
                                  variant="outlined"
                                  label="Message"
                                  fullWidth
                                />
                              </Col>
                              <Col>
                                <button className="btn btn-primary">
                                  Send Message <SendIcon />
                                </button>
                              </Col>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                );
                return comp;
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default MyChats;
