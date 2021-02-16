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
        console.log("Already requested");
      }
      if (response.status === 200) {
        console.log(" Requested");
      }
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
