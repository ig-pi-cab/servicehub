const mongoose = require("mongoose");
const logger = require("./logger");

const connectMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in .env");

    await mongoose.connect(uri);
    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error("Mongo DB Connection error: " + err);
    process.exit(1);
  }
};

module.exports = connectMongo;
