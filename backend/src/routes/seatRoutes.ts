import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  confirmBooking,
  getMySeats,
  getSeats,
  lockSeat,
} from "../controllers/seatController";

const router = express.Router();

router.get("/getAll/mySeats", authMiddleware, getMySeats);
router.get("/getAll/:eventId", authMiddleware, getSeats);
router.post("/lockSeat/:seatId", authMiddleware, lockSeat);
router.post("/book", authMiddleware, confirmBooking);

export default router;
