export const addNotification = (userId, message, type, projectId, postId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    notification: message,
    type,
  };
  if (projectId !== undefined) {
    obj[projectId] = projectId;
  }
  if (postId !== undefined) {
    obj[postId] = postId;
  }
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  };
  //   console.log(settings);
  return fetch(
    `http://localhost:8081/notifications/addNotification/${userId}`,
    settings
  );
};
export const getNotifications = () => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let requestObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:8081/notifications/${userId}`, requestObj);
};
