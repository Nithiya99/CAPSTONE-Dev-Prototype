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
