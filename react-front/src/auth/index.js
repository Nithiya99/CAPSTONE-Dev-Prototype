export const signup = (user) => {
  return fetch("http://localhost:8081/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch("http://localhost:8081/signin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const authenticate = (jwt, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  next();
  return fetch("http://localhost:8081/signout", {
    method: "GET",
  })
    .then((response) => {
      console.log("signout", response);
      return response.json;
    })
    .catch((err) => console.log(err));
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const newProject = (project) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    title: project.title,
    description: project.description,
    skills: project.skills,
    roles: project.roleDetails
  }
  let settings = {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(obj)
  } 
  console.log(settings.body)
  return fetch(`http://localhost:8081/project/new/${userId}`, settings)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};