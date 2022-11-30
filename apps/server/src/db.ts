import mongoose from "mongoose";

export const startDb = async () => {
  await mongoose.connect("mongodb://localhost:27017/trello");
  console.log("MongoDB connection successful ⚡️");
};
