import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Use Google's DNS servers for MongoDB SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected ..."))
  .catch((err) => console.log("MongoDB connection error:", err));