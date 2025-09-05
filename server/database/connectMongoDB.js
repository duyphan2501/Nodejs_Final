import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const connectToDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error("Mongodb uri does not exist in .env file");
    await mongoose.connect(mongoURI);
    console.log("Connect to DB successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB