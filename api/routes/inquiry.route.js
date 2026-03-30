import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  createInquiry,
  getUserInquiries,
  getAgentInquiries,
} from "../controllers/inquiry.controller.js";

const router = express.Router();

router.post("/", verifyToken, createInquiry);
router.get("/me", verifyToken, getUserInquiries);
router.get("/agent", verifyToken, requireRole("AGENT", "ADMIN"), getAgentInquiries);

export default router;

