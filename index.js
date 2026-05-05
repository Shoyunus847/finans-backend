import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import auth from "./middleware/authmidd.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://finance-tracker-frontend-gray.vercel.app"],
  credentials: true
}));

app.use(express.json());



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", auth, transactionRoutes);

// MONGO CONNECT

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error", err));

app.listen(PORT, () => {
  console.log("Server ishga tushdi", PORT);
});



