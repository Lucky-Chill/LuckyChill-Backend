const express = require("express");

const classroomRoutes = require("./classroom.routes");
const reservationRoutes = require("./reservation.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/classrooms", classroomRoutes);
router.use("/reservations", reservationRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
