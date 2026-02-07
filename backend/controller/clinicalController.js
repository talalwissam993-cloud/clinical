import { Clinical } from "../models/ClinicalSchema.js";
import cloudinary from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// --- CREATE NEW CLINICAL ---
export const postClinical = catchAsyncErrors(async (req, res, next) => {
    // 1. Image Check
    if (!req.files || !req.files.clinicImages) {
        return next(new ErrorHandler("Clinical Images Required!", 400));
    }

    // 2. Data Parsing (The Danger Zone)
    let parsedDoctors = [];
    let parsedHours = {};

    try {
        // Handle Doctors
        if (req.body.doctors) {
            // If it's already an array, use it. If it's a string, parse it.
            parsedDoctors = typeof req.body.doctors === "string"
                ? JSON.parse(req.body.doctors)
                : req.body.doctors;
        }

        // Handle Opening Hours
        if (req.body.openingHours) {
            parsedHours = typeof req.body.openingHours === "string"
                ? JSON.parse(req.body.openingHours)
                : req.body.openingHours;
        }
    } catch (err) {
        console.error("JSON Parse Error:", err);
        return next(new ErrorHandler("Invalid format for doctors or hours", 400));
    }

    // 3. Cloudinary Upload
    const { clinicImages } = req.files;
    const filesArray = Array.isArray(clinicImages) ? clinicImages : [clinicImages];
    const uploadedImages = [];

    for (const file of filesArray) {
        const res = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "CLINICAL_IMAGES",
        });
        uploadedImages.push({ public_id: res.public_id, url: res.secure_url });
    }

    // 4. Database Save
    const { name, description, email, phone, address, city, specialties } = req.body;

    const clinical = await Clinical.create({
        name,
        description,
        email,
        phone,
        specialties: specialties ? specialties.split(",") : [],
        location: { address, city },
        images: uploadedImages,
        doctors: parsedDoctors,
        openingHours: parsedHours,
    });

    res.status(200).json({
        success: true,
        message: "Clinical Registered Successfully!",
        clinical,
    });
});

// --- UPDATE CLINICAL ---
export const updateClinical = catchAsyncErrors(async (req, res, next) => {
    let clinical = await Clinical.findById(req.params.id);
    if (!clinical) {
        return next(new ErrorHandler("Clinical Not Found!", 404));
    }

    // Handle New Image Upload if provided
    if (req.files && req.files.clinicImage) {
        const { clinicImage } = req.files;

        // Delete old image from Cloudinary
        await cloudinary.v2.uploader.destroy(clinical.images[0].public_id);

        // Upload new image
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(
            clinicImage.tempFilePath,
            { folder: "CLINICAL_IMAGES" }
        );

        req.body.images = [{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }];
    }

    clinical = await Clinical.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Clinical Updated!",
        clinical,
    });
});

// --- DELETE CLINICAL ---
export const deleteClinical = catchAsyncErrors(async (req, res, next) => {
    const clinical = await Clinical.findById(req.params.id);
    if (!clinical) {
        return next(new ErrorHandler("Clinical Not Found!", 404));
    }

    // Delete image from Cloudinary before removing from DB
    const imageId = clinical.images[0].public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await clinical.deleteOne();
    res.status(200).json({
        success: true,
        message: "Clinical Deleted!",
    });
});

// --- GET ALL CLINICALS ---
export const getAllClinicals = catchAsyncErrors(async (req, res, next) => {
    // .sort({ createdAt: -1 }) puts the newest entries at the top
    const clinicals = await Clinical.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        clinicals,
    });
});