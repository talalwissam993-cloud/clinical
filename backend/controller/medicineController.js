import { Medicine } from "../models/medicineSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// 1. ADD NEW MEDICINE (With Duplicate Check)
export const addMedicine = catchAsyncErrors(async (req, res, next) => {
    const { name, brand, type, strength, price, stock, category, description, prescriptionRequired } = req.body;

    if (!name || !price || !category || !stock) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Check if medicine already exists to avoid duplicates
    const isExist = await Medicine.findOne({ name: name.trim() });
    if (isExist) {
        return next(new ErrorHandler("Medicine already registered in pharmacy", 400));
    }

    const medicine = await Medicine.create({
        name, brand, type, strength, price, stock, category, description, prescriptionRequired
    });

    res.status(201).json({
        success: true,
        message: "Medicine added to Pharmacy Registry",
        medicine
    });
});

// 2. GET ALL MEDICINES
export const getAllMedicines = catchAsyncErrors(async (req, res, next) => {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        medicines
    });
});

// 3. UPDATE MEDICINE 
export const updateMedicine = catchAsyncErrors(async (req, res, next) => {
    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
        return next(new ErrorHandler("Medicine not found", 404));
    }

    medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: "Medicine Updated Successfully!",
        medicine
    });
});

// 4. DELETE MEDICINE
export const deleteMedicine = catchAsyncErrors(async (req, res, next) => {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
        return next(new ErrorHandler("Medicine not found", 404));
    }

    await medicine.deleteOne();

    res.status(200).json({
        success: true,
        message: "Medicine removed from registry"
    });
});