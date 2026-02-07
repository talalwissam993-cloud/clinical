import express from "express";
import { addMedicine, getAllMedicines, updateMedicine, deleteMedicine } from "../controller/medicineController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js"; // Optional safety

const router = express.Router();

router.post("/add", isAdminAuthenticated, addMedicine);
router.get("/all", getAllMedicines);
router.put("/update/:id", isAdminAuthenticated, updateMedicine);
router.delete("/delete/:id", isAdminAuthenticated, deleteMedicine);

export default router;