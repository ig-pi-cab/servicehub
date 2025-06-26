const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken({ id, roles, activeRole }) {
  return jwt.sign({ id, roles, activeRole }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
