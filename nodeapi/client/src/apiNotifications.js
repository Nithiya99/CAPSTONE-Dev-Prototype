export const addNotification = (userId, message, type, projectId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notification: message,
      type,
      projectId,
    }),
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
