import express from "express";
import {
  getUsers,
  Login,
  Register,
  promoteToOrganizer,
  getUser,
  uploadImage,
} from "../controllers/authController";
import upload from "../../uploadService";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/users/:id", getUser);
router.get("/users", getUsers);
router.put("/users/:id/role", promoteToOrganizer);
router.post("/uploads", authMiddleware, upload.single("avatar"), uploadImage);

export default router;
