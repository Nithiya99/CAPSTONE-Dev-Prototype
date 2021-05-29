import React, { useState } from "react";
import { AttachFile, Description, PictureAsPdf } from "@material-ui/icons";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Button } from "react-bootstrap";
import { processResumes } from "./apiUser";
let array = require("./ranking.json");

const handlePreviewIcon = (fileObject, classes) => {
  const { type } = fileObject.file;
  const iconProps = {
    className: classes.image,
  };

  return (
    <>
      <div>
        <PictureAsPdf {...iconProps} />
      </div>
      <div>{fileObject.file.name}</div>
    </>
  );
};
export const PdfDropZone = () => {
  const [fileObjects, setFileObjects] = useState([]);
  const [finalObj, setFinalObj] = useState({});
  const findscore = (data) => {
    console.log(data);
    array.map((obj) => {
      if (obj.Name === data.college) data["score"] = obj.Score;
    });
    let obj = finalObj;
    let nameObj = { [data.name]: { ...data } };
    Object.assign(obj, nameObj);
    setFinalObj(obj);
  };

  return (
    <>
      <DropzoneAreaBase
        fileObjects={fileObjects}
        acceptedFiles={[".pdf"]}
        onAdd={(newFileObjs) => {
          console.log("onAdd", newFileObjs);
          //   newFileObjs.map((file) => {
          //     let files = [...fileObjects];
          //     files.push(file);
          //     setFileObjects(files);
          //   });
          setFileObjects([].concat(fileObjects, newFileObjs));
        }}
        onDelete={(deleteFileObj) => {
          setFileObjects((newFileObjs) =>
            newFileObjs.filter((file) => file !== deleteFileObj)
          );
          console.log("NewOnes:", fileObjects);
        }}
        getPreviewIcon={handlePreviewIcon}
      />
      <Button
        onClick={() => {
          //   const data = new FormData();
          //   data.append("files", fileObjects);
          //   console.log(fileObjects);
          let finalObj = {};
          let files = [];
          fileObjects.map((file) => {
            files.push(file.file);
          });
          files.map((file) => {
            processResumes(file).then((data) => {
              findscore(data);
            });
          });
        }}
      >
        Process
      </Button>
    </>
  );
};
