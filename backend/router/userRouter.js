import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getAllUsers,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
  deleteDoctor,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
import { addNewNurse, getAllNurses, deleteNurse, updateNurseStatus } from "../controller/userController.js";


const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/doctors", getAllDoctors);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/users", getAllUsers)
router.delete("/doctor/delete/:id", isAdminAuthenticated, deleteDoctor);

router.post("/nurse/addnew", isAdminAuthenticated, addNewNurse);
router.get("/nurses", getAllNurses);
router.delete("/nurse/delete/:id", isAdminAuthenticated, deleteNurse);
router.put("/nurse/update/:id", isAdminAuthenticated, updateNurseStatus);
export default router;
