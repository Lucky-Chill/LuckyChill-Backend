const express = require("express");
const reservationController = require("../controllers/reservation.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", requireAuth, reservationController.createReservation);
router.get("/me", requireAuth, reservationController.getMyReservations);

module.exports = router;
