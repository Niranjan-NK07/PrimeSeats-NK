import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  venue: string;
  dateTime: Date;
  organizerId: string;
  category: string;
  status: "upcoming" | "cancelled" | "completed";
  totalSeats: number;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    venue: { type: String, required: true },
    dateTime: { type: Date, required: true },
    organizerId: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["upcoming", "cancelled", "completed"],
      default: "upcoming",
    },
    totalSeats: { type: Number, required: true },
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
