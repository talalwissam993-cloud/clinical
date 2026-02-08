import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: { type: String, required: true },
    senderId: { type: String, required: true }, 
    text: { type: String, required: true },
    time: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// FIX: Check if model exists in 'mongoose.models' before defining it
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
