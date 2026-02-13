import mongoose from "mongoose";

const chemistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    // Changed from nurseLicenseNumber to pharmacyLicenseNumber
    pharmacyLicenseNumber: {
        type: String,
        required: true,
        unique: true
    },
     department: {
        type: String,
        required: false,
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
    qualification: {
        type: String,
        required: true,
        // Updated enums to reflect Pharmaceutical degrees
        enum: [
            "Bachelor of Pharmacy (B.Pharm)",
            "Doctor of Pharmacy (Pharm.D)",
            "Master of Pharmacy (M.Pharm)",
            "Certified Pharmacy Technician (CPhT)"
        ]
    },
    // A chemist usually works at a Pharmacy or a Hospital

    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: [true, "Chemist must be assigned to a hospital"],
    },

    shift: {
        type: String,
        required: true,
        enum: ["Morning", "Evening", "Night"]
    },
    emergencyContact: { type: String, required: true }
}, { timestamps: true });


export const Chemist = mongoose.model("Chemist", chemistSchema);
