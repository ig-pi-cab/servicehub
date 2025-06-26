const Service = require("../models/Service");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const mongoose = require("mongoose");

const serviceCategories = require("../config/serviceCategories");

async function createService({ providerId, data }) {
  const validProvider = await User.findById(providerId);

  if (!validProvider) {
    throw new AppError("Proveedor no encontrado", 404, { field: "providerId" });
  }

  if (!validProvider.roles.includes("provider")) {
    throw new AppError("El usuario no tiene rol de proveedor", 400, {
      field: "providerId",
    });
  }
  const service = new Service({
    providerRef: providerId,
    ...data,
  });
  await service.save();
  return service;
}

async function findServiceById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("ID de servicio inválido", 400, { field: "Service ID" });
  }

  const validService = await Service.findById(id);
  if (!validService) {
    throw new AppError("Servicio no encontrado", 404);
  }

  return validService;
}

async function findAvailableServices() {
  const services = await Service.find()
    .populate("providerRef", "name email")
    .sort({ createdAt: -1 });
  return services;
}

async function findServiceByNameOrCategory(search, category) {
  const categoryGroups = serviceCategories;
  const categoryNames = categoryGroups.flatMap(
    (group) => group.categories || []
  );

  if (!search && !category) {
    throw new Error(
      "Debe especificar al menos una búsqueda por texto o categoría"
    );
  }

  const query = { isActive: true };

  const projection = {
    name: 1,
    description: 1,
    category: 1,
  };

  if (search) {
    query.$text = { $search: search };
    projection.score = { $meta: "textScore" };
  }

  if (category) {
    if (!categoryNames.includes(category)) {
      throw new Error("Categoría inválida");
    }
    query.category = category;
  }

  const result = await Service.find(query)
    .sort(search ? { score: { $meta: "textScore" } } : {})
    .select(projection);

  return result;
}

module.exports = {
  createService,
  findServiceById,
  findAvailableServices,
  findServiceByNameOrCategory,
};
