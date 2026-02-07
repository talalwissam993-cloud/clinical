import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    // No more ObjectId! Just a simple string name
    patientName: {
        type: String,
        default: "Anonymous"
    },
    medications: [
        {
            name: { type: String, required: true },
            brand: { type: String },
            strength: { type: String },
            qty: { type: Number, required: true },
            dosage: { type: String, default: "As directed" },
        },
    ],
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Completed", "Cancelled"],
        default: "Pending"
    },
}, { timestamps: true });

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
