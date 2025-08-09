import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example middleware (adjust based on your app)
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
