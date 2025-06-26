const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const serviceRoutes = require("./services.routes");
const bookingRoutes = require("./booking.routes");
router.use("/auth", authRoutes);
router.use("/service", serviceRoutes);
router.use("/booking", bookingRoutes);

module.exports = router;
