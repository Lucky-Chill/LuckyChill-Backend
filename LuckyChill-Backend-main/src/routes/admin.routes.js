const express = require("express");
const adminController = require("../controllers/admin.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/admin.middleware");

const router = express.Router();

router.get(
  "/reservations",
  requireAuth,
  requireAdmin,
  adminController.getAdminReservations
);
router.patch(
  "/reservations/:reservationId/status",
  requireAuth,
  requireAdmin,
  adminController.updateReservationStatus
);

module.exports = router;
