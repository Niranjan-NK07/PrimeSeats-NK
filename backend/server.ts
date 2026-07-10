import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./src/routes/authRoutes";
import eventRouter from "./src/routes/eventRoutes";
import seatRouter from "./src/routes/seatRoutes";
import paymentRouter from "./src/routes/paymentRoutes";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(
  cors({
    origin: "https://prime-seats-nk.vercel.app",
    credentials: true,
  }),
);

app.use(express.json());
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
