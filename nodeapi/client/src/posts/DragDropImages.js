import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { createPost } from "./apiPosts";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "100%",
  height: "100%",
};

function DragDropImages(props) {
  const history = useHistory();
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );
  const postDetails = (image) => {
    createPost(image).then((data) => {
      console.log(data);
      if (data.error) {
        toast.warning(data.error);
      } else {
        toast.success("Created post Successfully");
        history.push("/home");
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <section className="container p-5 border rounded">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </section>
      <div className="text-center mt-2">
        <Button
          onClick={() => {
            files.map((file) => postDetails(file));
          }}
        >
          Post
        </Button>
      </div>
    </>
  );
}
export default DragDropImages;
