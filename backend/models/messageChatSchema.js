import mongoose from "mongoose";

const messageChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: { type: String, required: true },
    senderId: { type: String, required: true },
    role: { type: String, required: true }, // <--- CRITICAL: Add this
    text: { type: String, required: true },
    time: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800, // Auto-delete after 7 days
    },
});

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", messageChatSchema);
