import express from "express";
import { addMessage, getMessages } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/:chatId", verifyToken, addMessage);
router.get("/:chatId", verifyToken, getMessages);

export default router;