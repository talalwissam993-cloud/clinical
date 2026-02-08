import mongoose from "mongoose"; // Changed from require

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: { type: String, required: true },
    senderId: { type: String, required: true }, // Added for easy frontend comparison
    text: { type: String, required: true },
    time: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Changed from module.exports to export const
export const Message = mongoose.model("Message", messageSchema);
