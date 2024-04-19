import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectInastance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      "MongoDB connected !! DB Host:",
      connectInastance.connections[0].host
    );
  } catch (error) {
    console.error("Error in connectDB :: ", error);
    process.exit(1);
  }
};

export default connectDB;
