import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/verifyPayment", authMiddleware, verifyPayment);

export default router;
