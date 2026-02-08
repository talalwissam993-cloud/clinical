import { Hospital } from "../models/hospitalSchema.js";
import cloudinary from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const postHospital = catchAsyncErrors(async (req, res, next) => {
    // 1. Check for Images
    if (!req.files || !req.files.hospitalImages) {
        return next(new ErrorHandler("Hospital Images Required!", 400));
    }
    let parsedDoctors = [];

    try {
        // Handle Doctors
        if (req.body.doctors) {
            // If it's already an array, use it. If it's a string, parse it.
            parsedDoctors = typeof req.body.doctors === "string"
                ? JSON.parse(req.body.doctors)
                : req.body.doctors;
        }
    } catch (err) {
        console.error("JSON Parse Error:", err);
        return next(new ErrorHandler("Invalid format for doctors or hours", 400));
    }

    // 2. Helper for Safe Parsing
    // This handles both strings from FormData and already-parsed objects
    const safeParse = (data, fallback = []) => {
        if (!data) return fallback;
        if (typeof data === "string") {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return fallback;
            }
        }
        return data;
    };

    // Parse all incoming array/object fields
    const parsedDepartments = safeParse(req.body.departments);
    const parsedFacilities = safeParse(req.body.facilities);
    const parsedHours = safeParse(req.body.openingHours, {}); // Default to object

    // 3. Cloudinary Upload
    const { hospitalImages } = req.files;
    const filesArray = Array.isArray(hospitalImages) ? hospitalImages : [hospitalImages];
    const uploadedImages = [];

    for (const file of filesArray) {
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "HOSPITAL_GALLERY",
        });
        uploadedImages.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    // 4. Extract other fields
    const {
        name, description, address, city,
        emergencyPhone, receptionPhone, email, totalBeds, lat, lng
    } = req.body;

    // 5. Database Save
    // Ensure the keys match your hospitalSchema exactly
    const hospital = await Hospital.create({
        name,
        description,
        images: uploadedImages,
        departments: parsedDepartments,
        doctors: parsedDoctors,
        openingHours: parsedHours,
        location: {
            address,
            city,
            coordinates: {
                lat: lat ? Number(lat) : 0,
                lng: lng ? Number(lng) : 0
            }
        },
        contact: { emergencyPhone, receptionPhone, email },
        facilities: parsedFacilities,
        totalBeds: totalBeds ? Number(totalBeds) : 0,
    });

    res.status(201).json({
        success: true,
        message: "Hospital Registered Successfully!",
        hospital,
    });
});
// --- UPDATE HOSPITAL ---
export const updateHospital = catchAsyncErrors(async (req, res, next) => {
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) return next(new ErrorHandler("Hospital Not Found!", 404));

    // Handle Image Replacement
    if (req.files && req.files.hospitalImages) {
        // Delete all old images from Cloudinary
        for (const img of hospital.images) {
            await cloudinary.v2.uploader.destroy(img.public_id);
        }

        const { hospitalImages } = req.files;
        const filesArray = Array.isArray(hospitalImages) ? hospitalImages : [hospitalImages];
        const newImages = [];

        for (const file of filesArray) {
            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "HOSPITAL_IMAGES",
            });
            newImages.push({ public_id: result.public_id, url: result.secure_url });
        }
        req.body.images = newImages;
    }

    hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ success: true, message: "Hospital Updated!", hospital });
});

// --- DELETE HOSPITAL ---
export const deleteHospital = catchAsyncErrors(async (req, res, next) => {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return next(new ErrorHandler("Hospital Not Found!", 404));

    // Cleanup images in Cloudinary
    for (const img of hospital.images) {
        await cloudinary.v2.uploader.destroy(img.public_id);
    }

    await hospital.deleteOne();
    res.status(200).json({ success: true, message: "Hospital Deleted!" });
});

// --- GET ALL (FOR EXPO WITH DEEP POPULATION) ---
export const getAllHospitals = catchAsyncErrors(async (req, res, next) => {
    const hospitals = await Hospital.find()
        .populate("doctors") // Hospital-wide doctors
        .populate({
            path: "departments", // Clinical departments
            populate: { path: "doctors", model: "User" } // Doctors inside departments
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: hospitals.length,
        hospitals,
    });
});