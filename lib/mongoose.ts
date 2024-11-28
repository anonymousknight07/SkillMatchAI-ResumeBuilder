import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  if (isConnected) {
    return console.log("Already connected to MongoDB");
  }

  try {
    const options = {
      dbName: "resumebuilder",
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    };

    await mongoose.connect(process.env.MONGODB_URL, options);
    
    isConnected = true;
    console.log("Connected to MongoDB successfully");
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    isConnected = false;
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};