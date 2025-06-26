const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const errorHanlder = require("./middlewares/errorHandler");

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    console.log("Body:", req.body);
  }
  next();
});
console.log("Registrando rutas en /api...");

app.use("/api", routes);
app.use(errorHanlder);

module.exports = app;
