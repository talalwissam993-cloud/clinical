import { Message } from "../models/messageChatSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.status(200).json({
        success: true,
        messages,
    });
});

// Note: Post messages are usually handled via Socket for real-time, 
// but we keep a REST method as a backup.
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { text, senderName } = req.body;
    if (!text) {
        return next(new ErrorHandler("Message text is required", 400));
    }
    const message = await Message.create({
        text,
        senderName,
        sender: req.user._id,
    });
    res.status(201).json({ success: true, message });
});