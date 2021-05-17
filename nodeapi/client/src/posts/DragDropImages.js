import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { createPost } from "./apiPosts";
import { TextField } from "@material-ui/core";
import SkillsInput from "./../utils/signupbutton/Tagify/SkillsInput";

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
  const [title, set_title] = useState(String);
  const [tags, setTags] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          const data = new Uint8Array(binaryStr);
          // let result = webp.buffer2webpbuffer(reader.result, "jpg", "-q 80");
          // console.log(result);
          // result.then(function (result) {
          //   // you access the value from the promise here
          //   console.log(result);
          // });

          // console.log(reader.readAsArrayBuffer(file));
          // compress_images(
          //   file.path,
          //   file.path + "compressed",
          //   { compress_force: false, statistic: true, autoupdate: true },
          //   false,
          //   { jpg: { engine: "webp", command: false } },
          //   { png: { engine: "webp", command: false } },
          //   { svg: { engine: "svgo", command: false } },
          //   { gif: { engine: "gifwebp", command: false } },
          //   function (err, completed) {
          //     if (completed === true) console.log("done");
          // }
          // );
          // const buffer = binaryStr;
          // var binary = "";
          // var bytes = new Uint8Array(buffer);
          // var len = bytes.byteLength;
          // for (var i = 0; i < len; i++) {
          //   binary += String.fromCharCode(bytes[i]);
          // }
          // const base64 = btoa(binary);
          // console.log(base64);
        };
      });

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
    if (title === "") toast.warning("Please enter the Title");
    else {
      createPost(image, title, tags).then((data) => {
        // console.log(data);
        if (data.error) {
          toast.warning(data.error);
        } else {
          toast.success("Created post Successfully");
          history.push("/home");
        }
      });
    }
  };

  const onTextChange = (e) => {
    set_title(e.target.value);
  };

  const handleTags = (newSkills) => {
    let new_tags = [...newSkills];
    setTags(new_tags);
  };

  return (
    <>
      <ToastContainer />
      <TextField
        name="Title"
        onChange={(e) => onTextChange(e)}
        variant="outlined"
        label="Title"
        fullWidth
      />
      <SkillsInput label={<big>Tags</big>} setSkills={handleTags} />
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
            files.map((file) => console.log(file));
            files.map((file) => postDetails(file, title, tags));
          }}
        >
          Post
        </Button>
      </div>
    </>
  );
}
export default DragDropImages;
