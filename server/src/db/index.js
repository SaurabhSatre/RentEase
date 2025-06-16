import mongoose from "mongoose";

export let dbInstance = undefined;

const connectDB = async () => {
  try {
    //console.log(process.env.MONGODB_URI);
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    dbInstance = connectionInstance;
    console.log(`\n☘️  MongoDB Connected! \n`);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;