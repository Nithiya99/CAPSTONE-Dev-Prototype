import React from "react";
import { DropzoneDialogBase } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { uploadPicture } from "./apiPosts";
export default function PostImage() {
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);

  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{ right: "12px", top: "8px", position: "absolute" }}
        onClick={() => setOpen(false)}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Image
      </Button>

      <DropzoneDialogBase
        dialogTitle={dialogTitle()}
        acceptedFiles={["image/*"]}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={10485760}
        open={open}
        onAdd={(newFileObjs) => {
          console.log("onAdd", newFileObjs);
          setFileObjects([].concat(fileObjects, newFileObjs));
        }}
        onDelete={(deleteFileObj) => {
          let arr = [];
          fileObjects.map((file) => {
            // console.log(file.file.name, deleteFileObj.file.name);
            if (file.file.name !== deleteFileObj.file.name) {
              arr.push(file);
            }
            setFileObjects(arr);
          });
          console.log("onDelete", deleteFileObj);
        }}
        onClose={() => setOpen(false)}
        onSave={() => {
          console.log("onSave", fileObjects);
          fileObjects.map((file) => {
            console.log("file data (base64):", file.data);
            uploadPicture(file.data, file.file.name).then((data) =>
              console.log("data:", data)
            );
          });
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
