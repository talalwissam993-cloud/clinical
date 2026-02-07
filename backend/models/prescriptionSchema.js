// models/prescriptionSchema.js
const prescriptionSchema = new mongoose.Schema({
    // Relation for data integrity
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    // String for fast display on the "Lonely Page"
    patientName: { type: String, required: true }, 
    medications: [
        {
            name: String,
            brand: String,
            qty: Number,
            dosage: String
        }
    ],
    status: { type: String, default: "Pending" }
}, { timestamps: true });
