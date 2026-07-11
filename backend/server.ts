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
      if (!origin) {
        callback(null, true);
        return;
      }

      // Allow exact matches from allowlist
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Allow Vercel preview domains (e.g. <name>-<hash>.vercel.app)
      try {
        const hostname = new URL(origin).hostname;
        if (
          /\.vercel\.app$/.test(hostname) ||
          /\.onrender\.com$/.test(hostname)
        ) {
          callback(null, true);
          return;
        }
      } catch (e) {
        // fall through to block
      }

      console.warn("Blocked CORS attempt from:", origin);
      // Do not throw — deny CORS without turning it into a server error
      callback(null, false);
    },
    credentials: true,
  }),
);

// Ensure preflight requests are handled for all routes
app.options(/.*/, cors());

// Simple request logger for debugging deployed 404/OPTIONS issues
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

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

// Generic error handler to ensure errors are logged and a simple response returned
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  try {
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }
  } catch (e) {
    // ignore
  }
});
