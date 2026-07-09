import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  section: string;
  row: string;
  number: string;
  status: "available" | "locked" | "booked";
  lockedUntil?: Date;
}

const seatSchema = new Schema<ISeat>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    section: { type: String, default: "General" },
    row: { type: String },
    number: { type: String },
    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available",
    },
    lockedUntil: Date,
  },
  { timestamps: true },
);

export default mongoose.model<ISeat>("Seat", seatSchema);
