import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Wisdom } from "../models/wisdomSchema.js"; // Ensure you create this schema
import cloudinary from "cloudinary";

// --- 1. ADD NEW WISDOM (POST) ---
export const postWisdom = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Wisdom Image Required!", 400));
    }

    const { wisdomImage } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(wisdomImage.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }

    const { title, category, desc, theme } = req.body;

    if (!title || !category || !desc || !theme) {
        return next(new ErrorHandler("Please Provide Full Wisdom Details!", 400));
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        wisdomImage.tempFilePath,
        { folder: "WISDOM_HUB" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Cloudinary Upload Failed!", 500));
    }

    const wisdom = await Wisdom.create({
        title,
        category,
        desc,
        theme,
        image: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "New Wisdom Published!",
        wisdom,
    });
});

// --- 2. UPDATE WISDOM (PUT) ---
export const updateWisdom = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let wisdom = await Wisdom.findById(id);

    if (!wisdom) {
        return next(new ErrorHandler("Wisdom Not Found!", 404));
    }

    // If a new image is being uploaded
    if (req.files && req.files.wisdomImage) {
        const { wisdomImage } = req.files;

        // Delete old image from Cloudinary
        await cloudinary.v2.uploader.destroy(wisdom.image.public_id);

        // Upload new image
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(
            wisdomImage.tempFilePath,
            { folder: "WISDOM_HUB" }
        );

        req.body.image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    wisdom = await Wisdom.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Wisdom Updated Successfully!",
        wisdom,
    });
});

// --- 3. DELETE WISDOM (DELETE) ---
export const deleteWisdom = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const wisdom = await Wisdom.findById(id);

    if (!wisdom) {
        return next(new ErrorHandler("Wisdom Not Found!", 404));
    }

    // Remove image from Cloudinary
    const wisdomImageId = wisdom.image.public_id;
    await cloudinary.v2.uploader.destroy(wisdomImageId);

    // Remove from Database
    await wisdom.deleteOne();

    res.status(200).json({
        success: true,
        message: "Wisdom Deleted!",
    });
});

// --- 4. GET ALL WISDOM (GET) ---
export const getAllWisdom = catchAsyncErrors(async (req, res, next) => {
    const wisdom = await Wisdom.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        wisdom,
    });
});