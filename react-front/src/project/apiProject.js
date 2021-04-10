export const newProject = (project) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    title: project.title,
    description: project.description,
    skills: project.skills,
    roles: project.roleDetails,
  };
  let checkSettings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  fetch(
    `http://localhost:8081/project/check/?X=${obj.title}&X1=${obj.description}`,
    checkSettings
  )
    .then((response) => {
      // let val = response.json();
      // console.log(val);
      return response.json();
    })
    .then((val) => {
      console.log(val);
      if (val.message === "Can be added!") {
        let settings = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj),
        };
        // console.log(settings.body);
        return fetch(`http://localhost:8081/project/new/${userId}`, settings)
          .then((response) => {
            return response.json();
          })
          .catch((err) => console.log(err));
      } else {
        return { error: val.message, similar: val.data };
      }
    });
  // console.log(response.json());
  // return response.json();
};
export const updateProject = (project, projectId) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let obj = {
    title: project.title,
    description: project.description,
    skills: project.skills,
    roles: project.roleDetails,
    team: project.team,
    tasks: project.tasks,
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
  return fetch(
    `http://localhost:8081/project/edit/${userId}/${projectId}`,
    settings
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const leaveProject = (userId, projectId, token) => {
  return fetch(`http://localhost:8081/project/leave/${userId}/${projectId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log("Done");
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
export const finish = (projectId, token) => {
  return fetch("http://localhost:8081/project/finish/" + `${projectId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log("Project has been marked as completed");
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getTeam = (projectId) => {
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch("http://localhost:8081/project/team/" + projectId.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const addTask = (projectId, task) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  // task_title: "",
  //     task_description: "",
  //     task_responsible: "",
  //     task_completed: false,
  //     task_optimistic: "",
  //     task_pessimistic: "",
  //     task_mostLikely: "",
  let Obj = {
    taskName: task.task_title,
    taskDescription: task.task_description,
    assignedTo: task.task_responsible_ids,
    status: task.task_completed,
    optimisticTime: task.task_optimistic,
    mostLikelyTime: task.task_mostLikely,
    pessimisticTime: task.task_pessimistic,
  };
  let settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(Obj),
  };
  console.log(settings.body);
  return fetch(
    `http://localhost:8081/project/tasks/${userId}/${projectId}`,
    settings
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listmytasks = () => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let requestObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`http://localhost:8081/projects/user/${userId}/`, requestObj)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getTasks = (projectId) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  return fetch(
    "http://localhost:8081/project/tasks/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const putPredecessors = (projectId, taskId, connectId) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let Obj = {
    taskId: taskId,
    connectId: connectId,
  };
  return fetch(
    "http://localhost:8081/project/tasks/predecessors/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Obj),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const putConnections = (projectId, source, target) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let Obj = {
    from: source,
    to: target,
  };
  return fetch(
    "http://localhost:8081/project/connections/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Obj),
    }
  )
    .then((response) => {
      // console.log(response.json());
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const getConnections = (projectId) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;

  return fetch(
    "http://localhost:8081/project/connections/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const putPosition = (projectId, taskId, position) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let Obj = {
    taskId: taskId,
    position: position,
  };
  return fetch(
    "http://localhost:8081/project/position/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Obj),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//new functions
export const updateTask = (task, projectId) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  // console.log(task.id);
  let Obj = {
    id: task.id,
    taskName: task.title,
    taskDescription: task.description,
    pessimisticTime: parseInt(task.pessimisticTime),
    optimisticTime: parseInt(task.optimisticTime),
    mostLikelyTime: parseInt(task.mostLikelyTime),
    status: task.laneId,
  };
  // console.log(task);
  return fetch(
    "http://localhost:8081/project/task/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Obj),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteTask = (taskId, projectId) => {
  let userId = JSON.parse(localStorage.getItem("jwt")).user._id;
  let token = JSON.parse(localStorage.getItem("jwt")).token;
  let Obj = {
    id: taskId,
  };
  // console.log(task);
  return fetch(
    "http://localhost:8081/project/task/" +
      userId.toString() +
      "/" +
      projectId.toString(),
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Obj),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
