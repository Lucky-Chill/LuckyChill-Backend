const express = require("express");
const classroomController = require("../controllers/classroom.controller");

const router = express.Router();

router.get(
  "/:classroomId/unavailable-dates",
  classroomController.getUnavailableDates
);
router.get("/:classroomId/schedule", classroomController.getScheduleByDate);
router.get("/:classroomId", classroomController.getClassroomById);

module.exports = router;
