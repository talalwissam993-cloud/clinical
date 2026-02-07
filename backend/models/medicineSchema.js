import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Medicine name is required"],
        trim: true,
        unique: true // Prevents adding "Panadol" twice
    },
    brand: {
        type: String,
        required: [true, "Brand/Manufacturer name is required"]
    },
    type: {
        type: String,
        required: true,
        enum: ["Tablet", "Syrup", "Capsule", "Injection", "Cream", "Drops"],
        default: "Tablet"
    },
    strength: {
        type: String, // e.g., "500mg" or "10ml"
        required: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"], // Added safety
        default: 0
    },
    prescriptionRequired: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    image: {
        public_id: String,
        url: String
    },
    category: {
        type: String,
        enum: ["Antibiotics", "Pain Relief", "Vitamin", "Cardiology", "First Aid", "General"], // Added "General" to match frontend
        required: true,
        default: "General"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Medicine = mongoose.model("Medicine", medicineSchema);