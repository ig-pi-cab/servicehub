const express = require("express");
const router = express.Router();
const {
  createServiceHandler,
  getServiceById,
  getAvailableServices,
  getServicesByNameOrCategory,
} = require("../controllers/serviceController");

const authMiddleware = require("./../middlewares/authenticate");
router.get("/search", getServicesByNameOrCategory);

router.get("/services", getAvailableServices);
// Crear servicio (POST /services)
router.post("/", authMiddleware, createServiceHandler);

// Obtener servicio por ID (GET /services/:id)
router.get("/:id", authMiddleware, getServiceById);

module.exports = router;
