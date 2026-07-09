import mongoose from "mongoose";
import Event from "../models/Event.ts";
import Seat from "../models/Seat.ts";

export const getEvents = async (req: any, res: any) => {
  try {
    const now = new Date();
    const events = await Event.find({ dateTime: { $gt: now } }).sort({
      createdAt: -1,
    });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const getEvent = async (req: any, res: any) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID!" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "No event found!" });
    }

    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const searchEvents = async (req: any, res: any) => {
  try {
    const { query, category, location } = req.query;

    const searchCriteria: any = {
      dateTime: { $gt: new Date() },
    };

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (location) {
      searchCriteria.venue = { $regex: location, $options: "i" };
    }

    const events = await Event.find(searchCriteria).sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const createEvent = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      venue,
      dateTime,
      organizerId,
      category,
      status,
      totalSeats,
    } = req.body;

    if (req.user.role !== "organizer") {
      return res
        .status(403)
        .json({ error: "Only organizers can create events" });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required!" });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      venue,
      dateTime: new Date(dateTime),
      organizerId,
      category,
      status,
      totalSeats,
    });

    await event.save();

    for (let i = 1; i <= event.totalSeats; i++) {
      await Seat.create({
        eventId: event._id,
        section: "General",
        row: "A",
        number: i?.toString(),
        status: "available",
      });
    }

    return res.status(201).json({ message: "Event created!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};
