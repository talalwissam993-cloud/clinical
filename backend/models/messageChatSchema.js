import mongoose from "mongoose";

const messageChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, // Fixed for ES Modules
        ref: "User", 
        required: true,
    },
    senderName: { type: String, required: true },
    senderId: { type: String, required: true }, // Add this back for your Frontend logic
    text: { type: String, required: true },
    time: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800,
    },
});

// Name it ChatMessage specifically
export const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", messageChatSchema);

