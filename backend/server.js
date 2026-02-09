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

  socket.on("send_message", async (data) => {
    try {
      // Use 'Message' (to match your import at the top of the file)
      const savedMessage = await Message.create({
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        time: data.time,
      });

      // Broadcast the message that now contains the MongoDB _id
      io.emit("receive_message", savedMessage); 
      console.log("Message saved and broadcasted:", savedMessage._id);
    } catch (error) {
      console.error("Error saving message to DB:", error);
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
