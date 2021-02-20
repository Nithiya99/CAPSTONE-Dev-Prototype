export const newProject = (project) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    title: project.title,
    description: project.description,
    skills: project.skills,
    roles: project.roleDetails,
  };
  let settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  };
  console.log(settings.body);
  return fetch(`http://localhost:8081/project/new/${userId}`, settings)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const request = (user, project, role) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    roleId: role,
  };
  let requestObj = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  };
  return fetch(
    `http://localhost:8081/project/request/${user}/${project}`,
    requestObj
  )
    .then((response) => {
      if (response.status === 400) {
        alert("Already requested");
      }
      if (response.status === 200) {
        alert(" Requested");
      }
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const acceptRequest = (userId, projectId, acceptUserId, roleId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let acceptObj = {
    acceptUserId: acceptUserId,
    roleId: roleId,
  };
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(acceptObj),
  };
  return fetch(
    `http://localhost:8081/requests/accept/${userId}/${projectId}`,
    settings
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const declineRequest = (userId, projectId, declineUserId, roleId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let declineObj = {
    rejectUserId: declineUserId,
    roleId: roleId,
  };
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(declineObj),
  };
  return fetch(
    `http://localhost:8081/requests/decline/${userId}/${projectId}`,
    settings
  )
    .then((response) => {
      window.location.reload();
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const listmyprojects = () => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let requestObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:8081/projects/user/${userId}`, requestObj)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const listprojects = () => {
  return fetch("http://localhost:8081/projects", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const abandon = (projectId, token) => {
  return fetch("http://localhost:8081/project/delete/" + `${projectId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log("done");
      return response.json();
    })
    .catch((err) => console.log(err));
};
