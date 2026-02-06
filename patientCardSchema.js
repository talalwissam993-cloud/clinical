import mongoose from "mongoose";

const patientCardSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Patient ID is required"],
        unique: true,
        index: true,
    },

    // 1. BIOMETRICS
    bloodGroup: {
        type: String,
        required: [true, "Blood group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    height: { type: Number, required: [true, "Height is required"] },
    weight: { type: Number, required: [true, "Weight is required"] },

    // 2. EMERGENCY CONTACT
    emergencyContact: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relationship: { type: String, required: true },
    },

    // 3. CLINICAL EXAMINATIONS
    examinations: [
        {
            testName: { type: String, required: true },
            category: {
                type: String,
                required: true,
                enum: ["Radiology", "Lab", "Cardiology", "General"],
                index: true,
            },
            doctorNotes: { type: String },
            examinationDate: { type: Date, default: Date.now },
            testImage: {
                public_id: { type: String },
                url: { type: String },
            },
        },
    ],

    // 4. MEDICATIONS
    medications: [
        {
            name: { type: String, required: true },
            dosage: String,
            frequency: String,
            duration: String,
            status: {
                type: String,
                enum: ["Active", "Completed", "Stopped"],
                default: "Active"
            },
        },
    ],
}, {
    timestamps: true, // Replaces manual createdAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// BMI Virtual Calculation
patientCardSchema.virtual('bmi').get(function () {
    if (this.height && this.weight) {
        const h = this.height / 100;
        return parseFloat((this.weight / (h * h)).toFixed(2));
    }
    return undefined;
});

export const PatientCard = mongoose.model("PatientCard", patientCardSchema);