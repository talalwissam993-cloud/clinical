import mongoose from "mongoose";
import validator from "validator";

const clinicalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Clinical Name is required!"],
        trim: true,
        minLength: [3, "Name must contain at least 3 characters!"],
    },
    description: {
        type: String,
        required: [true, "Description is required!"],
        maxLength: [1000, "Description cannot exceed 1000 characters!"],
    },
    // Array of Doctors linked by their ID
    doctors: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User", // Assuming your doctor schema is part of the User model
        },
    ],
    images: [
        {
            public_id: String,
            url: String,
        },
    ],
    email: {
        type: String,
        required: [true, "Clinical Email is required!"],
        validate: [validator.isEmail, "Please provide a valid email!"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required!"],
        minLength: [10, "Phone number must contain exactly 10 digits!"],
        maxLength: [10, "Phone number must contain exactly 10 digits!"],
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
    },
    specialties: [String], // e.g., ["Cardiology", "Pediatrics"]
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Clinical = mongoose.model("Clinical", clinicalSchema);