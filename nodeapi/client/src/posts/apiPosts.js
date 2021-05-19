import axios from "axios";
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
export const uploadPicture2 = (data) => {
  axios.post(`http://localhost:3000/convertToWebp`, data);
};
export const uploadVideo = (data) => {
  console.log(data);
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
export const createVideoPost = async (video, title, tags, project) => {
  const data = new FormData();
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  data.append("myVideo", video);
  let settings = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  let response = await axios.post(
    `http://localhost:3000/postVideo`,
    data,
    settings
  );
  let result = response.data.result;
  if (result.url) {
    let url = result.url;
    return fetch(`/post/new/video/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.toString(),
      },
      body: JSON.stringify({
        video: url,
        title: title,
        tags: tags,
        project: project,
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
};
const functioncall = (final_url, title, tags, project, token, userId) => {
  console.log(final_url);
  let settings =
    project !== "Personal"
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.toString(),
          },
          body: JSON.stringify({
            pic: final_url,
            title: title,
            tags: tags,
            project,
          }),
        }
      : {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.toString(),
          },
          body: JSON.stringify({
            pic: final_url,
            title: title,
            tags: tags,
          }),
        };
  return fetch(`/post/new/${userId}`, settings)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
export const createPost = async (images, title, tags, project) => {
  console.log(images);
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;

  let final_url = [];
  await images.map(async (image) => {
    const data = new FormData();
    data.append("title", title);
    data.append("tags", tags);
    data.append("myImage", image);
    let settings = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    let response = await axios.post(
      `http://localhost:3000/convertToWebp`,
      data,
      settings
    );
    let result = await response.data.result;
    if (result.url) {
      let url = result.url;
      final_url.push(url);
    }
    if (final_url.length === images.length)
      return functioncall(final_url, title, tags, project, token, userId);
  });

  // data.append("file", image);
  // data.append("upload_preset", "workshaketrial");
  // data.append("cloud_name", "workshaketrial");
  // return fetch("https://api.cloudinary.com/v1_1/workshaketrial/image/upload", {
  //   method: "post",
  //   body: data,
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     //   setUrl(data.url);
  //     if (data.url) {
  //       let url = data.url;

  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

export const likepost = (post_id) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    userId: userId,
    postId: post_id,
  };
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  };
  // console.log(settings.body);
  return fetch(`http://localhost:3000/post/like/${post_id}`, settings)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const dislikepost = (post_id) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    userId: userId,
    postId: post_id,
  };
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  };
  // console.log(settings.body);
  return fetch(`http://localhost:3000/post/dislike/${post_id}`, settings)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const addcomment = (post_id, comment) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let userName = JSON.parse(localStorage.getItem("jwt")).user.name;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    userId: userId,
    userName: userName,
    postId: post_id,
    comment: comment,
  };
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  };
  // console.log(settings.body);
  return fetch(`http://localhost:3000/post/addcomment/${post_id}`, settings)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getpost = (post_id) => {
  let settings = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  // console.log(settings.body);
  return fetch(`http://localhost:3000/post/${post_id}`, settings)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
