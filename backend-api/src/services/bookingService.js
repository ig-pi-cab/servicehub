const Booking = require("./../models/Booking");
const Service = require("./../models/Service");
const User = require("./../models/User");

const mongoose = require("mongoose");
const AppError = require("./../utils/AppError");

const { publishToQueue } = require("./../rabbitmq/publisher");

async function findBookingById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("ID de agenadmiento inválido", 400, {
      field: "Booking ID",
    });
  }
  const validBooking = await Booking.findById(id);
  if (!validBooking) return new Error("Booking not found");
  return validBooking;
}

async function createBookingHandler({
  clientId,
  serviceRef,
  scheduledAt,
  responses = [],
}) {
  if (!serviceRef || !mongoose.Types.ObjectId.isValid(serviceRef)) {
    throw new Error("ID de servicio inválido");
  }

  const date = new Date(scheduledAt);
  if (isNaN(date)) {
    throw new Error("Fecha programada inválida");
  }
  if (date <= new Date()) {
    throw new Error("La fecha debe ser futura");
  }

  if (!Array.isArray(responses)) {
    throw new Error("Las respuestas deben ser un arreglo");
  }
  for (const r of responses) {
    if (typeof r.label !== "string" || r.label.trim() === "") {
      throw new Error("Cada respuesta debe tener un label válido");
    }
    if (typeof r.value !== "string" || r.value.trim() === "") {
      throw new Error("Cada respuesta debe tener un valor válido");
    }
  }

  const validService = await Service.findById(serviceRef);
  if (!validService) {
    throw new Error("Servicio no encontrado");
  }

  const providerId = validService.providerRef;
  if (String(providerId) === String(clientId)) {
    throw new Error("No puedes reservar tu propio servicio");
  }

  const client = await User.findById(clientId);
  if (!client || !client.email) {
    throw new Error("No se pudo obtener el correo del cliente");
  }

  const booking = new Booking({
    serviceRef,
    scheduledAt: date,
    responses,
    providerRef: providerId,
    clientRef: clientId,
  });
  await booking.save();

  await publishToQueue("booking_created", {
    bookingId: booking._id,
    scheduledAt: booking.scheduledAt,
    email: client.email,
  });

  return booking;
}

async function findBookingsByUser(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("userId inválido", 400, { field: "userId" });
  }

  const bookings = await Booking.find({
    $or: [{ clientRef: userId }, { providerRef: userId }],
  })
    .populate("serviceRef providerRef clientRef")
    .sort({ scheduledAt: -1 });

  return bookings;
}

async function findBookingsByClient(clientId) {
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw new AppError("clientId inválido", 400, { field: "clientRef" });
  }
  const bookings = await Booking.find({ clientRef: clientId })
    .populate("serviceRef providerRef clientRef")
    .sort({ scheduledAt: -1 });
  return bookings;
}

async function findBookingsByProvider(providerId) {
  if (!mongoose.Types.ObjectId.isValid(providerId)) {
    throw new AppError("providerId inválido", 400, { field: "providerRef" });
  }
  const bookings = await Booking.find({ providerRef: providerId })
    .populate("serviceRef providerRef clientRef")
    .sort({ scheduledAt: -1 });
  return bookings;
}

async function findUserBookings(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("userId inválido", 400, { field: "userId" });
  }

  const [asClient, rawAsProvider] = await Promise.all([
    Booking.find({ clientRef: userId })
      .populate("serviceRef providerRef clientRef")
      .sort({ scheduledAt: -1 }),

    Booking.find({ providerRef: userId })
      .populate("serviceRef providerRef clientRef")
      .sort({ scheduledAt: -1 }),
  ]);

  // Agrupar bookings por serviceRef
  const groupedAsProvider = rawAsProvider.reduce((acc, booking) => {
    const serviceId = booking.serviceRef._id.toString();
    if (!acc[serviceId]) {
      acc[serviceId] = {
        service: booking.serviceRef,
        bookings: [],
      };
    }
    acc[serviceId].bookings.push(booking);
    return acc;
  }, {});

  // Convertir objeto a array
  const asProvider = Object.values(groupedAsProvider);

  return { asClient, asProvider };
}

async function updateBookingStatus(bookingId, newStatus) {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new AppError("bookingId inválido", 400, { field: "bookingId" });
  }
  if (!newStatus || typeof newStatus !== "string") {
    throw new Error("El nuevo estado debe ser una cadena no vacía");
  }
  const allowedStatuses = ["pending", "confirmed", "cancelled"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new AppError("Estado inválido", 400, { field: "status" });
  }
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError("Booking no encontrado", 404);
  }

  // Validar transición de estado
  const current = booking.status;
  if (current === "cancelled") {
    throw new AppError("No se puede cambiar un booking cancelado", 400);
  }
  if (current === "confirmed" && newStatus === "pending") {
    throw new AppError(
      "No se puede revertir un booking confirmado a pendiente",
      400
    );
  }

  booking.status = newStatus;
  await booking.save();
  return booking;
}

module.exports = {
  createBookingHandler,
  findBookingById,
  findBookingsByUser,
  findBookingsByClient,
  findBookingsByProvider,
  findUserBookings,
  updateBookingStatus,
};
