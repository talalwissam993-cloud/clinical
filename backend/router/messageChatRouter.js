import express from "express";
import { getAllMessages, sendMessage } from "../controller/messageChatController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Use the flexible one

const router = express.Router();

// Allow ANY authenticated user to see and send messages
router.get("/all", isAuthenticated, getAllMessages);
router.post("/send", isAuthenticated, sendMessage);

export default router;
