const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Links to your existing User model
        required: true,
    },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Message = mongoose.model("Message", messageSchema);