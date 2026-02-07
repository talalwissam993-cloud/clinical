import express from "express";
import {
    postClinical,
    updateClinical,
    deleteClinical,
    getAllClinicals
} from "../controller/clinicalController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to register a new clinical (Admin Only)
router.post("/addnew", isAdminAuthenticated, postClinical);

// Route to get all clinicals (Can be public or restricted)
router.get("/getall", getAllClinicals);

// Route to update a specific clinical by ID (Admin Only)
router.put("/update/:id", isAdminAuthenticated, updateClinical);

// Route to delete a specific clinical by ID (Admin Only)
router.delete("/delete/:id", isAdminAuthenticated, deleteClinical);

export default router;