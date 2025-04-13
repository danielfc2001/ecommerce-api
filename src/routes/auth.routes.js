import express from "express";
import {
  createUser,
  loginUser,
  verifyUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/verify", verifyUser);

router.post("/login", loginUser);

router.post("/register", createUser);

export default router;
