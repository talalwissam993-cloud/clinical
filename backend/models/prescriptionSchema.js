import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    // Link to the Patient (to get their name/NIC)
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // The items from your MedicinePicker cart
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
        enum: ["Pending", "Dispensed", "Cancelled"],
        default: "Pending"
    },
}, { timestamps: true }); // timestamps provide the date for the Admin Panel

export const Prescription = mongoose.model("Prescription", prescriptionSchema);