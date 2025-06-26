const { verifyToken } = require("../utils/jwt");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      roles: decoded.roles,
      activeRole: decoded.activeRole,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = authenticate;
