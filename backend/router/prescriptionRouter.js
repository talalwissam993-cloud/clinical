import express from "express";
import {
    createPrescription,
    getAllPrescriptions,
    updatePrescriptionStatus
} from "../controller/prescriptionController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js"; // Adjust based on your auth file

const router = express.Router();

// Route for the Mobile App to save
router.post("/new", createPrescription);

// Routes for the Admin Panel
router.get("/all", isAdminAuthenticated, getAllPrescriptions);
router.put("/status/:id", isAdminAuthenticated, updatePrescriptionStatus);

export default router;