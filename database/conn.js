const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error", err));
