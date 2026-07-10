import express from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  searchEvents,
} from "../controllers/eventController";
import { authMiddleware, requireRole } from "../middlewares/authMiddleware";
import upload from "../../uploadService";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  requireRole("organizer"),
  createEvent,
);
router.get("/getAll", authMiddleware, getEvents);
router.get("/search", authMiddleware, searchEvents);
router.get("/:eventId", authMiddleware, getEvent);

export default router;
