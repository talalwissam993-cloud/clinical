import express from "express";
import {
    postWisdom,
    getAllWisdom,
    updateWisdom,
    deleteWisdom,
} from "../controller/wisdomController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public or Doctor/Patient access to see the wisdom
router.get("/getall", getAllWisdom);

// Admin only access to manage the content
router.post("/add", isAdminAuthenticated, postWisdom);
router.put("/update/:id", isAdminAuthenticated, updateWisdom);
router.delete("/delete/:id", isAdminAuthenticated, deleteWisdom);

export default router;