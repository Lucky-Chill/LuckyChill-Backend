const express = require("express");
const notificationController = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", notificationController.getNotificationList);
router.patch("/:notificationId/read", notificationController.readNotification);

module.exports = router;
