import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const init = async function () {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connection to MongoDB established successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default init;
