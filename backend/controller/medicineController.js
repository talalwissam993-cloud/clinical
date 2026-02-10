import { Medicine } from "../models/medicineSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary";

// 1. ADD MEDICINE (Already perfect)
export const addMedicine = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Medicine Image Required!", 400));
    }

    const { medicineImage } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(medicineImage.mimetype)) {
        return next(new ErrorHandler("File format not supported!", 400));
    }

    const { name, brand, type, strength, price, stock, category, description } = req.body;
    if (!name || !price || !stock) {
        return next(new ErrorHandler("Please fill required fields!", 400));
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        medicineImage.tempFilePath,
        { folder: "PHARMACY_MEDICINES" }
    );

    const medicine = await Medicine.create({
        name, brand, type, strength, price, stock, category, description,
        image: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({ success: true, message: "Medicine Saved!", medicine });
});

// 2. GET ALL MEDICINES
export const getAllMedicines = catchAsyncErrors(async (req, res, next) => {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, medicines });
});

// 3. UPDATE MEDICINE (With Image Replacement)
export const updateMedicine = catchAsyncErrors(async (req, res, next) => {
    let medicine = await Medicine.findById(req.params.id);
    if (!medicine) return next(new ErrorHandler("Medicine not found", 404));

    const newData = { ...req.body };

    // Check if a new image is being uploaded
    if (req.files && req.files.medicineImage) {
        const file = req.files.medicineImage;

        // 1. Delete the OLD image from Cloudinary
        if (medicine.image && medicine.image.public_id) {
            await cloudinary.v2.uploader.destroy(medicine.image.public_id);
        }

        // 2. Upload the NEW image
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { folder: "PHARMACY_MEDICINES" }
        );

        newData.image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    medicine = await Medicine.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, message: "Updated Successfully!", medicine });
});

// 4. DELETE MEDICINE (With Cloudinary Cleanup)
export const deleteMedicine = catchAsyncErrors(async (req, res, next) => {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return next(new ErrorHandler("Medicine not found", 404));

    // Remove the image from Cloudinary so you don't waste space
    if (medicine.image && medicine.image.public_id) {
        await cloudinary.v2.uploader.destroy(medicine.image.public_id);
    }

    await medicine.deleteOne();

    res.status(200).json({ success: true, message: "Medicine and image deleted!" });
});
