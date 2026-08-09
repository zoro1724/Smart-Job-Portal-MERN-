import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "job-portal",
            serverSelectionTimeoutMS: 10000,
        });

        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);

        return true;

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        return false;
    }
};

export default connectDB;