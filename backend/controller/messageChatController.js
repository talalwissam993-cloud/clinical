import { ChatMessage } from "../models/messageChatSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// 1. Get all messages (Now role-agnostic)
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    // We sort by createdAt to ensure the chat history is in the right order
    const messages = await ChatMessage.find().sort({ createdAt: 1 });
    
    res.status(200).json({
        success: true,
        messages,
    });
});

// 2. Send message (REST Backup)
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { text, time } = req.body;

    if (!text) {
        return next(new ErrorHandler("Message text is required!", 400));
    }

    // This creates the record using the credentials of whoever is logged in
    const message = await ChatMessage.create({
        sender: req.user._id,
        senderId: req.user._id,
        senderName: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role, 
        text,
        time,
    });

    res.status(200).json({
        success: true,
        message,
    });
});
