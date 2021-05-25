exports.addNotification = (req, res) => {
  let user = req.profile;
  if (req.body.projectId !== undefined) {
    user.notifications.push({
      message: req.body.notification,
      read: false,
      notifType: req.body.type ? req.body.type : "request",
      projectId: req.body.projectId,
    });
  }
  if (req.body.postId !== undefined) {
    user.notifications.push({
      message: req.body.notification,
      read: false,
      notifType: req.body.type ? req.body.type : "request",
      postId: req.body.postId,
    });
  }
  user.newNotification = true;
  console.log(user.notifications);
  user.save(); //(err) => {
  //   if (err)
  //     return res.status !== undefined
  //       ? res.status(400).json({ error: "Notification cannot be added" })
  //       : console.log("Notification not added");
  // });
  return res.status !== undefined
    ? res.status(200).json({ user })
    : console.log("Notification added");
};

exports.getNotifications = (req, res) => {
  let user = req.profile;
  if (user.notifications) {
    let notifs = user.notifications;
    // if (user.newNotification) {
    //   user.newNotification = false;
    //   user.save((err) => {
    //     if (err) return res.status(400).json({ error: "new Notif error" });
    //   });
    // }
    return res.status(200).json({ notifications: notifs });
  }
  return res.status(200).json({ notifications: [] });
};
