import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import auth from "./middleware/authmidd.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "upload")));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error", err));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", auth, transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server ishga tushdi", PORT);
});