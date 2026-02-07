import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Prescription } from "../models/prescriptionSchema.js";

// 1. CREATE NEW PRESCRIPTION (From Mobile App)
// backend/controllers/prescriptionController.js
export const createPrescription = catchAsyncErrors(async (req, res, next) => {
    const { medications, patientName } = req.body;

    if (!medications || medications.length === 0) {
        return next(new ErrorHandler("No medicines in cart", 400));
    }

    const prescription = await Prescription.create({
        patientName: patientName || "Walk-in Patient",
        medications
    });

    res.status(201).json({ success: true, prescription });
});

// 2. GET ALL PRESCRIPTIONS (For the Lonely Admin Page)
export const getAllPrescriptions = catchAsyncErrors(async (req, res, next) => {
    // We no longer use .populate() because you are saving 
    // the patientName as a simple string now.
    const prescriptions = await Prescription.find()
        .sort({ createdAt: -1 }); // Keep this to show "Final Added" at the top

    res.status(200).json({
        success: true,
        prescriptions
    });
});

// 3. UPDATE STATUS (Admin Panel - mark as Dispensed/Cancelled)
export const updatePrescriptionStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!prescription) return next(new ErrorHandler("Prescription not found", 404));

    res.status(200).json({
        success: true,
        message: "Status updated",
        prescription
    });

});


