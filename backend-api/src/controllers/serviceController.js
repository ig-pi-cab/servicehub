const {
  findServiceById,
  createService,
  findAvailableServices,
  findServiceByNameOrCategory,
} = require("./../services/serviceService");
const {
  successResponse,
  successCreatedResponse,
} = require("../utils/successResponse");

async function createServiceHandler(req, res, next) {
  try {
    const providerId = req.user.id;
    const { ...data } = req.body;
    const service = await createService({ providerId, data });
    successCreatedResponse(res, {
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

async function getServiceById(req, res, next) {
  try {
    const { id } = req.params;
    const service = await findServiceById(id);
    successResponse(res, {
      message: "Service retreived succesfully",
      status: 200,
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

async function getAvailableServices(req, res, next) {
  try {
    const services = await findAvailableServices();
    successResponse(res, {
      message: "Service retreived succesfully",
      status: 200,
      data: services,
    });
  } catch (error) {
    next(error);
  }
}

async function getServicesByNameOrCategory(req, res, next) {
  try {
    const { search, category } = req.query;
    const result = await findServiceByNameOrCategory(search, category);
    successResponse(res, {
      message: "Result obtained",
      status: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createServiceHandler,
  getServiceById,
  getAvailableServices,
  getServicesByNameOrCategory,
};
