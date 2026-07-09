import mongoose from "mongoose";
import Seat from "../models/Seat.ts";

export const getSeats = async (req: any, res: any) => {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      return res.status(400).json({ message: "Invalid event !" });
    }

    await Seat.updateMany(
      { eventId, status: "locked", lockedUntil: { $lt: new Date() } },
      { status: "available", lockedUntil: "" },
    );

    const seats = await Seat.find({ eventId });

    return res.status(200).json(seats);
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const getMySeats = async (req: any, res: any) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const seats = await Seat.find({ userId, status: "booked" }).sort({
      updatedAt: -1,
    });

    return res.status(200).json(seats || []);
  } catch (err: any) {
    console.error("getMySeats error:", err);
    return res.status(500).json({ message: err.message || "Server Error!" });
  }
};

export const lockSeat = async (req: any, res: any) => {
  try {
    const seatId = req.params.seatId;
    const { eventId } = req.body;

    if (!seatId) {
      return res.status(400).json({ message: "Invalid seat !" });
    }

    const seat = await Seat.findById(seatId);
    if (!seat || seat.status !== "available") {
      return res.status(400).json({ error: "Seat not available" });
    }

    seat.userId = req.user.id;
    seat.eventId = eventId;
    seat.status = "locked";
    seat.lockedUntil = new Date(Date.now() + 2 * 60 * 1000);
    await seat.save();
    return res.json(seat);
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const confirmBooking = async (req: any, res: any) => {
  try {
    const { seatIds, eventId } = req.body;
    const userId = req.user.id;

    const seats = await Seat.find({
      _id: { $in: seatIds },
      eventId,
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

    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { status: "booked", $unset: { lockedUntil: "" }, userId },
    );

    res.json({ message: "Booking confirmed", seatIds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error!" });
  }
};
