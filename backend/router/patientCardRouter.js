import express from "express";
import * as controller from "../controller/patientCardController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// --- PATIENT & ADMIN ACCESSIBLE ---
// Use a logical OR check or a combined middleware if your auth supports it.
// Here we allow both to access this specific endpoint.
router.get("/get/:patientId", controller.getPatientCard);
// --- ADMIN ONLY ROUTES ---
router.post("/upsert",isAdminAuthenticated, controller.upsertPatientCard);
router.get("/search/:query", controller.searchCardByNameOrNIC);
router.delete("/delete-full/:id", isAdminAuthenticated, controller.deleteFullCard);

// Examinations
router.post("/exam/add/:id", isAdminAuthenticated, controller.addExamination);
router.delete("/exam/delete/:cardId/:examId", isAdminAuthenticated, controller.deleteExamination);

// Medications
router.post("/med/add/:id", isAdminAuthenticated, controller.addMedication);
router.patch("/med/status/:cardId/:medId", isAdminAuthenticated, controller.updateMedicationStatus);

router.get("/my-reminders", isPatientAuthenticated, controller.getActiveReminders);
export default router;




