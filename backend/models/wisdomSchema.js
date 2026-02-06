import mongoose from "mongoose";

const wisdomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required!"],
        minLength: [3, "Title must contain at least 3 characters!"],
    },
    category: {
        type: String,
        required: [true, "Category is required!"],
        enum: ["Protocol", "Wellness", "Efficiency", "Tech"], // Restricts to your specific types
    },
    desc: {
        type: String,
        required: [true, "Description is required!"],
        minLength: [10, "Description must contain at least 10 characters!"],
    },
    theme: {
        type: String,
        default: "blue",
        enum: ["blue", "green", "purple", "gold"], // Matches your frontend CSS themes
    },
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Wisdom = mongoose.model("Wisdom", wisdomSchema);