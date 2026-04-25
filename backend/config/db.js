import mongoose from "mongoose";

const connectDb=async()=>{
    try {
        // environment variable name matches .env file
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;