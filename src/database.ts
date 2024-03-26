import mongoose from "mongoose";

const env = {
  MONGO_URI: "mongodb://127.0.0.1:27017/oz-tech-test?authSource=admin",
};

const init = async function () {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connection to MongoDB established successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default init;
