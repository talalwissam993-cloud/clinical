import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { Nurse } from "../models/nurseSchema.js";
import { Doctor } from "../models/doctorSchema.js"; // <--- ADD THIS LINE

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form !", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;

  const {
    firstName, lastName, email, phone, nic, dob, gender, password,
    doctorLicenseNumber, qualification, doctorDepartment, shift, emergencyContact,
    assignedHospital
  } = req.body;

  // 1. Validation for ALL professional and personal fields
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender ||
    !password || !doctorLicenseNumber || !qualification || !doctorDepartment ||
    !shift || !emergencyContact || !assignedHospital) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Doctor with this email already exists!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Failed To Upload Doctor Avatar", 500));
  }

  // 2. Create the base User first (Role: Doctor)
  const user = await User.create({
    firstName, lastName, email, phone, nic, dob, gender, password,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // 3. Create the Doctor Profile linked to User and Hospital
  const doctor = await Doctor.create({
    user: user._id,
    hospital: assignedHospital,
    doctorLicenseNumber,
    qualification,
    department: doctorDepartment,
    emergencyContact,
    shift
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered Successfully",
    doctor,
  });
});

// UPDATED: Fetches from the Doctor collection to get professional details
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await Doctor.find()
    .populate("user", "firstName lastName email phone docAvatar") // Personal details from User
    .populate("hospital", "name"); // Hospital name from Hospital

  res.status(200).json({
    success: true,
    doctors,
  });
});

// UPDATED: Deletes both the Profile and the User account
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // This is the Doctor profile ID
  const doctorProfile = await Doctor.findById(id);

  if (!doctorProfile) {
    return next(new ErrorHandler("Doctor Profile Not Found!", 404));
  }

  const userId = doctorProfile.user;

  // Delete the profile first, then the user
  await doctorProfile.deleteOne();
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "Doctor Profile and User Account Deleted Successfully!",
  });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "Doctor" } });
  res.status(200).json({
    success: true,
    users,
  });
});



export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});


// Nurse Controller 
export const addNewNurse = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Nurse Avatar Required!", 400));
  }
  const { docAvatar } = req.files;

  const {
    firstName, lastName, email, phone, nic, dob, gender, password,
    nurseLicenseNumber, qualification, department, shift, emergencyContact,
    assignedHospital // 1. ADD THIS: This matches your frontend formData key
  } = req.body;

  // 2. UPDATE VALIDATION: Add assignedHospital to the check
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender ||
    !password || !nurseLicenseNumber || !qualification || !department ||
    !shift || !emergencyContact || !assignedHospital) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Cloudinary Upload Failed!", 500));
  }

  const user = await User.create({
    firstName, lastName, email, phone, nic, dob, gender, password,
    role: "Nurse",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    }
  });

  // 3. UPDATE NURSE CREATE: Pass the hospital ID to the database
  const nurse = await Nurse.create({
    user: user._id,
    hospital: assignedHospital, // Links the nurse to the hospital in DB
    nurseLicenseNumber,
    qualification,
    department,
    shift,
    emergencyContact
  });

  res.status(200).json({
    success: true,
    message: "New Nurse Registered!",
    nurse
  });
});

// SHOW ALL NURSES
export const getAllNurses = catchAsyncErrors(async (req, res, next) => {
  // .populate('user') fetches the firstName, lastName, and docAvatar
  // .populate('hospital') fetches the name of the assigned facility
  const nurses = await Nurse.find()
    .populate("user", "firstName lastName email docAvatar")
    .populate("hospital", "name");

  res.status(200).json({
    success: true,
    nurses,
  });
});
// DELETE NURSE
export const deleteNurse = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // This is the Nurse ID
  const nurse = await Nurse.findById(id);

  if (!nurse) {
    return next(new ErrorHandler("Nurse Not Found!", 404));
  }

  // Delete both the Nurse profile and the associated User account
  const userId = nurse.user;
  await nurse.deleteOne();
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "Nurse and User Account Deleted!",
  });
});

// UPDATE NURSE (Shift or Status)
export const updateNurseStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let nurse = await Nurse.findById(id);

  if (!nurse) {
    return next(new ErrorHandler("Nurse Not Found!", 404));
  }

  nurse = await Nurse.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Nurse Details Updated!",
    nurse,
  });
});
