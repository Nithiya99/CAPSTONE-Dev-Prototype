import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUserById, unfollowUser } from "./apiUser";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";

const Following = ({ following_users }) => {
  const [show, setShow] = useState(false);
  const [users, setusers] = useState([]);

  useEffect(() => {
    let profiles = [];
    following_users.map((user) => {
      getUserById(user).then((data) => {
        console.log(data.user);
        profiles.push(data.user);
      });
      setusers(profiles);
    });
  }, [null]);

  return (
    <>
      <div
        onClick={() => setShow(true)}
      >{` ${following_users.length} Following`}</div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header>Following</Modal.Header>
        <Modal.Body>
          <div>
            {users.map((user, i) => (
              <div className="col">
                <div className="card mb-3" key={i}>
                  <div className="card-body">
                    <p className="card-text">{user.name}</p>
                    <button
                      className="btn btn-raised btn-primary ml-3"
                      onClick={(e) => {
                        unfollowUser(e, user._id).then((data) =>
                          console.log(data)
                        );
                      }}
                    >
                      UnFollow
                      <PersonAddDisabledIcon />
                    </button>
                    <Link
                      to={`/user/${user._id}`}
                      className="btn btn-raised btn-small btn-primary"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Following;
