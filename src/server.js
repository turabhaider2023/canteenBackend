import express from "express";
import dotenv from "dotenv";
import { connectToServer } from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import authRoutes from "./router/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic health route
app.get("/", (req, res) => {
  res.send("Server is running successfully ");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Start Server Function
const startServer = async () => {
  try {
    await connectToServer(); // MongoDB se connect karna
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Agar DB connect nahi hua to server band ho jaye
  }
};

startServer();


