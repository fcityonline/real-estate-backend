import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  createBooking,
  getUserBookings,
  getAgentBookings,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/me", verifyToken, getUserBookings);
router.get("/agent", verifyToken, requireRole("AGENT", "ADMIN"), getAgentBookings);

export default router;

