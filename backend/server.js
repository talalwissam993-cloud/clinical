import app from "./app.js";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import http from "http"; // <--- THIS WAS MISSING
import { ChatMessage } from "./models/messageChatSchema.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Create the HTTP Server using the Express 'app'
const server = http.createServer(app);

// 3. Initialize Socket.io with the HTTP Server
const io = new Server(server, {
  cors: {
    origin: "*", // In production, use your frontend URL
    methods: ["GET", "POST"],
  },
});

// 4. Socket.io Event Logic
// ... existing connection logic ...
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // 1. Existing Send Message Logic
 socket.on("send_message", async (data) => {
    try {
      const savedMessage = await ChatMessage.create({
        sender: data.senderId, // Matches the ObjectId ref
        senderId: data.senderId,
        senderName: data.senderName,
        role: data.role,      // <--- ADD THIS LINE
        text: data.text,
        time: data.time,
      });
      io.emit("receive_message", savedMessage);
    } catch (error) {
      console.error("CHAT ERROR:", error.message);
    }
});
  // 2. NEW: Admin/User Delete Logic
  socket.on("delete_message", async (messageId) => {
    try {
      await ChatMessage.findByIdAndDelete(messageId);
      // Broadcast the deletion so it disappears for everyone instantly
      io.emit("message_deleted", messageId);
      console.log("Message deleted:", messageId);
    } catch (error) {
      console.error("DELETE ERROR:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 5. Start the Server with Render-friendly Port Binding
const PORT = process.env.PORT || 4000;

// Adding "0.0.0.0" tells Render to accept external traffic
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
