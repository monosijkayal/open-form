import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import formRoutes from "./routes/forms";
import questionRoutes from "./routes/questionRoutes";
import responseRoutes from "./routes/responses";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON body

// MongoDB Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/forms", formRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/responses", responseRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
