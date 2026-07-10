import express from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  searchEvents,
} from "../controllers/eventController.ts";
import { authMiddleware, requireRole } from "../middlewares/authMiddleware.ts";
import upload from "../../uploadService.ts";

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
