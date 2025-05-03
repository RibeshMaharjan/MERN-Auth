import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI)
    console.log("DB connection successfully");
  } catch (error) {
    console.log("DB connection Failed.\nError: ", error.message);
    process.exit(1);
  }
}