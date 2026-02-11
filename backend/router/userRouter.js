import express from "express";
import {
  addNewAdmin,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
import { addNewNurse, getAllNurses, deleteNurse, updateNurseStatus } from "../controller/userController.js";
import { addNewDoctor, getAllDoctors, getAllUsers, deleteDoctor, } from "../controller/userController.js"
import { addNewChemist, getAllChemists, updateChemistStatus, deleteChemist } from "../controller/userController.js"; // Adjust path as needed
const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/users", getAllUsers)


router.post("/doctor/addnew", addNewDoctor);
router.get("/doctors", getAllDoctors);
router.delete("/doctor/delete/:id", isAdminAuthenticated, deleteDoctor);

router.post("/nurse/addnew", isAdminAuthenticated, addNewNurse);
router.get("/nurses", getAllNurses);
router.delete("/nurse/delete/:id", isAdminAuthenticated, deleteNurse);
router.put("/nurse/update/:id", isAdminAuthenticated, updateNurseStatus);

// Register a new chemist (Admin Only)
router.post("/chemist/addnew", isAdminAuthenticated, addNewChemist);

// Fetch all chemists for the dashboard
router.get("/chemists", getAllChemists);

// Update chemist details like shift or qualification
router.put("/chemist/update/:id", isAdminAuthenticated, updateChemistStatus);

// Remove chemist and their user account
router.delete("/chemist/delete/:id", isAdminAuthenticated, deleteChemist);

export default router;
