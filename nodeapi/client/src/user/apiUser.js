export const read = (userId, token) => {
  return fetch("http://localhost:8081/user/" + `${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const update = (userId, token, user) => {
  return fetch("http://localhost:8081/user/" + `${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const remove = (userId, token) => {
  return fetch("http://localhost:8081/user/" + `${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = () => {
  return fetch("http://localhost:8081/users", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("jwt")).user;
};

export const getUserById = (id) => {
  return fetch(`http://localhost:8081/userInfo/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getWords = () => {
  return fetch("http://localhost:8081/words", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const setRating = (userId, rating) => {
  let obj = {
    rating,
  };
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch(`http://localhost:8081/user/rating/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const followUser = (e, userId) => {
  e.preventDefault();
  let currentUserId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch(`http://localhost:8081/follow/${currentUserId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      followId: userId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export const unfollowUser = (e, userId) => {
  e.preventDefault();
  console.log(userId);
  let currentUserId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch(`http://localhost:8081/unfollow/${currentUserId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      followId: userId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export const getfollowers = (userId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch("http://localhost:8081/followers/" + `${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getfollowing = (userId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch("http://localhost:8081/following/" + `${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getfriends = (userId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch("http://localhost:8081/friends/" + `${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updatePersonalChat = (chat) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let Obj = {
    chat: chat,
  };
  return fetch("http://localhost:8081/updatechat", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(Obj),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
