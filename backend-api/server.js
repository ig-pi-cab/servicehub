require("dotenv").config();
const connectMongo = require("./src/config/mongo");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  });
});
