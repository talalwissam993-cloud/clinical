import app from "./app.js";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import http from "http"; // <--- THIS WAS MISSING
import { Message } from "./models/messageChatSchema.js";

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
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // When a user sends a message
// Inside your io.on("connection", (socket) => { ... })
socket.on("send_message", async (data) => {
    try {
        // 1. SAVE TO DATABASE (Using your MessageChat Schema)
        const savedMessage = await MessageChat.create({
            senderId: data.senderId,
            senderName: data.senderName,
            text: data.text,
            time: data.time,
        });

        // 2. BROADCAST TO EVERYONE (including the database ID)
        io.emit("receive_message", savedMessage); 
    } catch (error) {
        console.error("Error saving message:", error);
    }
});

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 5. Start the Server (USE server.listen, NOT app.listen)
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
