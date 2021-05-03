import React, { useEffect, useState } from "react";
import { getCurrentUser, getfriends, getUserById } from "./apiUser";
import DefaultProfile from "./../images/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Card, Button, Row, Tab, Col, Nav } from "react-bootstrap";
import { friendAdded } from "../store/user";
const MyChatsNew = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.user.friends);
  const [user, setUser] = useState({});
  useEffect(async () => {
    await getfriends(getCurrentUser()._id).then(async (data) => {
      let users = [];
      await data.map(async (user) => {
        await getUserById(user).then((u) => {
          // checkIfUserExists(friends, u.user)
          //   console.log(friends);
          dispatch(friendAdded({ user: u.user }));
        });
        // dispatch(setFriends({ friends: users }));
      });
    });
  }, []);
  //   console.log(user);
  return (
    <div>
      {friends.map((user, i) => (
        <Nav.Item>
          <Nav.Link
            eventKey={i}
            onClick={() => {
              setUser(user);
            }}
          >
            <div className="d-flex align-items-center">
              <div className="mr-3">
                <img src={DefaultProfile} style={{ width: "40px" }} />
              </div>
              <div>{user.name}</div>
            </div>
          </Nav.Link>
        </Nav.Item>
      ))}
    </div>
  );
};

export default MyChatsNew;
