import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Links to your base User model
        required: true,
    },
    nurseLicenseNumber: { type: String, required: true, unique: true },
    qualification: {
        type: String,
        required: true,
        enum: ["Registered Nurse (RN)", "Licensed Practical Nurse (LPN)", "Nurse Practitioner (NP)"]
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

export const Nurse = mongoose.model("Nurse", nurseSchema);