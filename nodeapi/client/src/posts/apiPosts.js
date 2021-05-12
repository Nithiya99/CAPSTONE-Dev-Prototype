export const getAllPosts = () => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let requestObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:3000/posts/`, requestObj);
};
export const getPostsOfUser = (userId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let requestObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:3000/posts/by/${userId}`, requestObj);
};

export const uploadPicture = async (base64Data, fileName) => {
  // var imageBuffer = new Buffer(base64Data, "base64"); //console = <Buffer 75 ab 5a 8a ...
  // fs.writeFile("test.jpg", imageBuffer, function (err) {
  //   //...
  //   console.log(imageBuffer);
  // });
  // base64Data = base64Data.split(",").pop();
  // console.log(base64Data);
  // const blob = b64toBlob(base64Data, contentType);
  // const blobUrl = URL.createObjectURL(blob);
  // // console.log("blob:", blob);
  // // console.log("blobURL:", blobUrl);
  // console.log(blobUrl);
  let object = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: base64Data, fileName: fileName }),
  };
  console.log("Object:", object);
  return fetch(`http://localhost:3000/convertToWebp`, object)
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((response) => {
      // console.log("url:", response.result.url);
      // return response.result.url;
      const data = response.result;
      let token = JSON.parse(localStorage.getItem("jwt")).token;
      let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
      if (data.url) {
        let url = data.url;
        return fetch(`http://localhost:3000/post/new/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.toString(),
          },
          body: JSON.stringify({
            pic: url,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            return data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};
export const createPost = (image) => {
  const data = new FormData();
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  data.append("file", image);
  data.append("upload_preset", "workshaketrial");
  data.append("cloud_name", "workshaketrial");
  return fetch("https://api.cloudinary.com/v1_1/workshaketrial/image/upload", {
    method: "post",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      //   setUrl(data.url);
      if (data.url) {
        let url = data.url;
        return fetch(`/post/new/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.toString(),
          },
          body: JSON.stringify({
            pic: url,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
