import express from "express";
import {
    postHospital,
    updateHospital,
    deleteHospital,
    getAllHospitals
} from "../controller/hospitalController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/addnew", isAdminAuthenticated, postHospital);
router.put("/update/:id", isAdminAuthenticated, updateHospital);
router.delete("/delete/:id", isAdminAuthenticated, deleteHospital);
router.get("/getall", getAllHospitals);

export default router;