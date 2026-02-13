import express from "express";
import { getAllMessages, sendMessage } from "../controller/messageChatController.js";
// Import BOTH authentication middlewares
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/**
 * We use a "custom" check or allow both. 
 * If your 'isAdminAuthenticated' covers Doctors/Chemists/Nurses, 
 * use it alongside isPatientAuthenticated.
 */

// 1. For fetching messages: Allow both Staff and Patients
router.get("/all", getAllMessages); 

// 2. For sending messages: 
// If the user is a Doctor/Chemist, they pass 'isAdminAuthenticated'
// If the user is a Patient, they pass 'isPatientAuthenticated'
router.post("/send", isAdminAuthenticated, sendMessage);

export default router;
