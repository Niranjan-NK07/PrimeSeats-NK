import express from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  searchEvents,
} from "../controllers/eventController.ts";
import { authMiddleware, requireRole } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.post("/create", authMiddleware, requireRole("organizer"), createEvent);
router.get("/getAll", authMiddleware, getEvents);
router.get("/search", authMiddleware, searchEvents);
router.get("/:eventId", authMiddleware, getEvent);

export default router;
