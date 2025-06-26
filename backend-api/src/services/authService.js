// import libraries
const bcrypt = require("bcrypt");
const User = require("./../models/User");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");
const { validate } = require("../models/Service");

async function registerUser({ name, password, email, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400, { field: "email" });
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    passwordHash,
    roles: ["client", "provider"],
    activeRole: role,
  });

  await user.save();
  const token = generateToken({
    id: user.id,
    roles: user.roles,
    activeRole: role,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      activeRole: user.activeRole,
    },
  };
}

async function loginUser({ email, inputPassword }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AppError("Usuario no registrado", 404, email);
  }

  const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError("Credenciales inválidas", 401);
  }
  const token = generateToken({
    id: user.id,
    roles: user.roles,
    activeRole: user.activeRole,
  });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      activeRole: user.activeRole,
    },
  };
}
module.exports = { registerUser, loginUser };
