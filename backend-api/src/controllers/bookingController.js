const bookingService = require("../services/bookingService");
const {
  successCreatedResponse,
  successResponse,
} = require("../utils/successResponse");

const {
  createBookingHandler,
  findBookingById,
  findBookingsByUser,
  findBookingsByClient,
  findBookingsByProvider,
  findUserBookings,
  updateBookingStatus,
} = bookingService;

async function createBooking(req, res, next) {
  try {
    const { serviceRef, scheduledAt, responses = [] } = req.body;
    const clientId = req.user.id;
    const booking = await createBookingHandler({
      clientId,
      serviceRef,
      scheduledAt,
      responses,
    });
    successCreatedResponse(res, {
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await findBookingById(id);
    successResponse(res, {
      message: "Booking retrieved successfully",
      status: 200,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

async function getUserBookings(req, res, next) {
  try {
    const userId = req.user.id;
    const bookings = await findUserBookings(userId);
    successResponse(res, {
      status: 200,
      message: "Bookings found succesfully for user",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

async function getBookingsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const bookings = await findBookingsByUser(userId);
    successResponse(res, {
      message: "Booking retrieved succesfully",
      status: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

async function getBookingsByClient(req, res, next) {
  try {
    const { clientId } = req.params;
    const bookings = await findBookingsByClient(clientId);
    successResponse(res, {
      message: "Booking retrieved succesfully",
      status: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

async function getBookingsByProvider(req, res, next) {
  try {
    const { providerId } = req.params;
    const bookings = await findBookingsByProvider(providerId);
    successResponse(res, {
      message: "Booking retrieved succesfully",
      status: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatusHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await updateBookingStatus(id, status);
    successResponse(res, {
      message: "Booking updated succesfully",
      status: 200,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByClient,
  getBookingsByProvider,
  getUserBookings,
  updateBookingStatusHandler,
};
