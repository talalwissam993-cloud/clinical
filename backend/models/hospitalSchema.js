import mongoose from "mongoose";
import validator from "validator";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Hospital name is required!"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Hospital description is required!"],
    },
    // Multiple Images Gallery
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    // Links this hospital to its clinical departments (e.g., Cardiology, ENT)
    departments: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Clinical",
        },
    ],
    // Direct link to Doctors assigned to the Hospital
    doctors: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
    },
    contact: {
        emergencyPhone: { type: String, required: true },
        receptionPhone: { type: String },
        email: {
            type: String,
            validate: [validator.isEmail, "Provide a valid hospital email"]
        },
    },
    facilities: [String],
    isEmergency24X7: {
        type: Boolean,
        default: true,
    },
    totalBeds: { type: Number },
    availableBeds: { type: Number },
    rating: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Hospital = mongoose.model("Hospital", hospitalSchema);