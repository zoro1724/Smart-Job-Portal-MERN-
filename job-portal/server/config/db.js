// import mongoose from "mongoose";

// // Function to connect to the MongoDB database
// const connectDB = async () => {

//     mongoose.connection.on('connected', () => console.log('Database Connected'))

//     await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)

// }

// export default connectDB

import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database Connected");
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "job-portal"
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;