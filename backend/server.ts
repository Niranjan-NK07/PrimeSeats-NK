import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./src/routes/authRoutes";
import eventRouter from "./src/routes/eventRoutes";
import seatRouter from "./src/routes/seatRoutes";
import paymentRouter from "./src/routes/paymentRoutes";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const port = process.env.PORT || 3000;
const app = express();

const allowedOrigins = [
  "https://prime-seats-nk.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/auth", authRouter);
app.use("/events", eventRouter);
app.use("/seats", seatRouter);
app.use("/payment", paymentRouter);
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
