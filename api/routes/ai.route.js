import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { recommendProperties } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/recommendations", verifyToken, recommendProperties);

export default router;

