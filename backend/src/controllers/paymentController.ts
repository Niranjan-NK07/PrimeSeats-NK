import crypto from "crypto";
import fs from "fs";
import path from "path";
// import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Seat from "../models/Seat";
import Razorpay from "razorpay";
import Event from "../models/Event";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

declare const process: {
  cwd(): string;
  env: {
    RAZORPAY_KEY_ID?: string;
    RAZORPAY_KEY_SECRET?: string;
  };
};

const loadEnvValue = (key: "RAZORPAY_KEY_ID" | "RAZORPAY_KEY_SECRET") => {
  const fromProcess = process.env[key]?.trim();
  if (fromProcess) {
    return fromProcess;
  }

  const envFileCandidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../../.env"),
  ];

  for (const envFilePath of envFileCandidates) {
    if (!fs.existsSync(envFilePath)) {
      continue;
    }

    const envFileContent = fs.readFileSync(envFilePath, "utf8");
    const match = envFileContent.match(new RegExp(`^${key}=(.+)$`, "m"));

    if (match?.[1]) {
      return match[1].trim().replace(/^['"]|['"]$/g, "");
    }
  }

  return "";
};

// Initialize Razorpay with validation
const initializeRazorpay = () => {
  const keyId = loadEnvValue("RAZORPAY_KEY_ID");
  const keySecret = loadEnvValue("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new Error(
      "❌ Razorpay credentials missing! Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file",
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const createOrder = async (req: any, res: any) => {
  try {
    const razorpay = initializeRazorpay();

    // console.log("Razorpay init check", {
    //   hasKeyId: Boolean(loadEnvValue("RAZORPAY_KEY_ID")),
    //   hasKeySecret: Boolean(loadEnvValue("RAZORPAY_KEY_SECRET")),
    // });

    const { seatIds, eventId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(401).json({ error: "No event matching!" });
    }

    const seats = await Seat.find({
      _id: { $in: seatIds },
      eventId,
      userId,
      status: "locked",
      lockedUntil: { $gt: new Date() },
    });

    for (const seat of seats) {
      if (
        seat.status !== "locked" ||
        !seat.lockedUntil ||
        seat.lockedUntil < new Date()
      ) {
        return res.status(400).json({
          message: `Seat ${seat._id} is not locked or lock expired`,
        });
      }
    }

    if (!Array.isArray(seatIds) || seats.length !== seatIds.length) {
      return res.status(400).json({ error: "Seats not locked by you" });
    }

    const amount = seats.length * event.pricePerSeat * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { eventId, userId, seatIds: seatIds.join(",") },
    });

    return res.json({ success: true, message: "Booking confirmed", order });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Razorpay order creation failed", err);

    if (errorMessage.includes("Unauthorized user")) {
      return res.status(401).json({ error: errorMessage });
    }

    return res.status(500).json({
      error: errorMessage,
      message: "Payment initialization failed",
    });
  }
};

export const verifyPayment = async (req: any, res: any) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      seatIds,
      eventId,
    } = req.body;
    const userId = req.user?.id;

    const keySecret = loadEnvValue("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      return res
        .status(500)
        .json({ error: "Razorpay secret is not configured" });
    }

    const providedSignature = `${razorpay_signature || ""}`.trim();
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // console.log("Razorpay signature verification", {
    //   orderId: razorpay_order_id,
    //   paymentId: razorpay_payment_id,
    //   providedSignatureLength: providedSignature.length,
    //   generatedSignatureLength: generatedSignature.length,
    //   match: generatedSignature === providedSignature,
    // });

    if (generatedSignature !== providedSignature) {
      return res.status(400).json({ error: "Payment signature mismatch" });
    }

    await Seat.updateMany(
      { _id: { $in: seatIds }, eventId, userId, status: "locked" },
      { $set: { status: "booked", userId }, $unset: { lockedUntil: "" } },
    );

    return res.json({ message: "Payment verified, seats booked" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
