module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Duplicado de clave única en MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      message: `El correo electrónico ya está registrado.`,
      field: Object.keys(err.keyPattern)[0],
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(err.field && { field: err.field }),
  });
};
