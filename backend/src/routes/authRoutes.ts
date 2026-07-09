import express from "express";
import {
  getUsers,
  Login,
  Register,
  promoteToOrganizer,
  getUser,
  uploadImage,
} from "../controllers/authController.ts";
import upload from "../../uploadService.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/users/:id", getUser);
router.get("/users", getUsers);
router.put("/users/:id/role", promoteToOrganizer);
router.post("/uploads", authMiddleware, upload.single("avatar"), uploadImage);

export default router;
