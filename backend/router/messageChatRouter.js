import express from "express";
import { getAllMessages, sendMessage } from "../controller/messageChatController.js";
import { isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", isPatientAuthenticated, getAllMessages);
router.post("/send", isPatientAuthenticated, sendMessage);

export default router;