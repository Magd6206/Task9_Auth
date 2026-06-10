require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
module.exports = connectDB;
