const express = require("express");
const router = express.Router();

const authMiddleware = require("./../middlewares/authenticate");

const bookingController = require("./../controllers/bookingController");
const {
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByClient,
  getBookingsByProvider,
  getUserBookings,
  updateBookingStatusHandler,
} = bookingController;

//Rutas especificas primero
router.post("/", authMiddleware, createBooking);
router.get("/user/:userId", authMiddleware, getBookingsByUser);
router.get("/client/:clientId", authMiddleware, getBookingsByClient);
router.get("/provider/:providerId", authMiddleware, getBookingsByProvider);
router.get("/my-bookings", authMiddleware, getUserBookings);
router.get("/:id", authMiddleware, getBookingById);
router.put("/:id", authMiddleware, updateBookingStatusHandler);

module.exports = router;
