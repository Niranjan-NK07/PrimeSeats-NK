import mongoose from "mongoose";
import User from "../models/User.ts";

export const Register = async (req: any, res: any) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists !" });
    }

    const user = await User.create({ username, email, password });

    const token = await (user as any).generateAuthToken();

    return res.status(201).json({
      token,
      username: user.username,
      email: user.email,
      authID: user._id,
      role: user.role,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({
      message: "Server Error !",
      error: err.message,
      stack: err.stack,
    });
  }
};

export const Login: any = async (req: any, res: any) => {
  try {
    const { username, password } = req?.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const matched = await (user as any).comparePassword(password);
    if (!matched) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = (user as any).generateAuthToken();

    res.status(200).json({
      token,
      username: user.username,
      email: user.email,
      authID: user._id,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error !" });
  }
};

export const getUser = async (req: any, res: any) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server Error !" });
  }
};
export const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server Error !" });
  }
};

export const promoteToOrganizer = async (req: any, res: any) => {
  try {
    const userId = req.params.id;
    const { role: roleFromBody } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = roleFromBody;
    await user.save();

    res.status(200).json({ message: "User role updated successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error !" });
  }
};

export const uploadImage: any = async (req: any, res: any) => {
  try {
    console.log(req?.user);
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    }

    if (req.query.userID && !mongoose.isValidObjectId(req.query.userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const fileURL = `/uploads/${req.file.filename}`;

    const userId = (req as any).user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: fileURL },
      { new: true },
    );

    res.status(200).json({ fileURL, updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
