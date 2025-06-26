const { registerUser, loginUser } = require("./../services/authService");
const {
  successResponse,
  successCreatedResponse,
} = require("../utils/successResponse");
async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    successCreatedResponse(res, {
      message: "User succesfully Created",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
async function login(req, res, next) {
  try {
    const user = await loginUser(req.body);
    successResponse(res, {
      message: "Login succeeded",
      status: 200,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
