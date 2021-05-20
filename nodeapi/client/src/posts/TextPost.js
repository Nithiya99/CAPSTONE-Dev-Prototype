import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactPlayer from "react-player/youtube";
import { Link } from "react-router-dom";
import YouTubeIcon from "@material-ui/icons/YouTube";
import * as youtubeMeta from "youtube-metadata-from-url";
import { createTextPost, createYoutubePost } from "./apiPosts";
import { toast } from "react-toastify";
import Sentiment from "sentiment";
const sentiment = new Sentiment();
const TextPost = (props) => {
  const [open, setOpen] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [title, setTitle] = useState("");
  const [type, setType] = useState("text");
  let [sentimentScore, setsentimentScore] = useState([]);
  useEffect(() => {
    if (validateYouTubeUrl(props.text)) {
      youtubeMeta.metadata(props.text).then(
        function (json) {
          //   console.log("Response:", json);
          setMetadata(json);
        },
        function (err) {
          console.log(err);
        }
      );
    }
  }, [props.text]);
  function handleClose() {
    setOpen(false);
  }
  function handleShow() {
    setOpen(true);
  }
  function validateYouTubeUrl(urlToParse) {
    if (urlToParse) {
      var regExp =
        /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (urlToParse.match(regExp)) {
        if (type !== "youtube") setType("youtube");
        return true;
      }
    }
    if (type !== "text") setType("text");
    return false;
  }
  function titleChange(e) {
    setTitle(e.target.value);
    findSentiment(e.target.value);
    console.log(title);
  }
  const findSentiment = (title) => {
    const result = sentiment.analyze(title);
    sentimentScore = setsentimentScore(result.score);
  };
  const { text } = props;
  //   console.log(text);
  return (
    <>
      <Button
        onClick={() => {
          if (text !== "") handleShow();
        }}
      >
        Text/Youtube Link
      </Button>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Your thoughts here...</Modal.Title>
          <Button onClick={handleClose}>x</Button>
        </Modal.Header>
        <Modal.Body>
          {validateYouTubeUrl(text) ? (
            <>
              <YouTubeIcon />
              {/* <a href={text} target={"_blank"}>
                {text.toString()} {console.log(metadata)}
              </a> */}
              <div>{metadata.title}</div>
              <ReactPlayer
                url={text}
                controls={true}
                width={window.width / 4}
              />
              <div>By {metadata.author_name}</div>
              <input
                type="text"
                id="youtubeText"
                className="form-control"
                onChange={(e) => titleChange(e)}
              />
            </>
          ) : (
            <h4>{text}</h4>
          )}
        </Modal.Body>
        <Modal.Footer>
          {sentimentScore >= -3 && (
            <Button
              onClick={() => {
                if (type === "text") {
                  createTextPost(text);
                }
                if (type === "youtube") {
                  if (title !== "") createYoutubePost(text, title, metadata);
                  else {
                    toast.warning("Enter caption for the post!");
                  }
                }
              }}
            >
              Sure?
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TextPost;
