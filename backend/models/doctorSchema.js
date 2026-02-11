import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Links to your base User model
        required: true,
    },
    doctorLicenseNumber: { type: String, required: true, unique: true },
    qualification: {
        type: String,
        required: true,
        // Update these to Doctor-specific qualifications
        enum: [
            "MBBS",
            "MD",
            "DO",
            "MS",
            "Board Certified Specialist",
            "Fellowship Trained"
        ]
    },
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: [true, "Nurse must be assigned to a hospital"],
    },
    department: {
        type: String,
        required: true,
        enum: ["ICU", "Emergency", "Pediatrics", "General Ward", "Operation Theater", "Internist",
            "Pediatrics",
            "Orthopedics",
            "Cardiology",
            "Neurology",
            "Oncology",
            "Radiology",
            "Physical Therapy",
            "Dermatology",
            "ENT",]
    },
    shift: { type: String, required: true, enum: ["Morning", "Evening", "Night"] },
    emergencyContact: { type: String, required: true }
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);