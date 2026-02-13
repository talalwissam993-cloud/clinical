import { ChatMessage } from "../models/messageChatSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllMessages = async (req, res, next) => {
    try {
        const messages = await ChatMessage.find().sort({ createdAt: 1 });
        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        next(error);
    }
};

// Note: Post messages are usually handled via Socket for real-time, 
// but we keep a REST method as a backup.
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { text, time } = req.body;

    // req.user is now available because we used 'isAuthenticated'
    const message = await ChatMessage.create({
        sender: req.user._id,
        senderId: req.user._id,
        senderName: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role, // Automatically picks 'Doctor', 'Chemist', etc.
        text,
        time,
    });

    res.status(200).json({
        success: true,
        message,
    });
});
