exports.addNotification = (req, res) => {
  let user = req.profile;
  user.notifications.push({
    message: req.body.notification,
    read: false,
    notifType: req.body.type ? req.body.type : "request",
  });
  user.newNotification = true;
  user.save((err) => {
    if (err)
      return res.status(400).json({ error: "Notification cannot be added" });
  });
  return res.status(200).json({ user });
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
