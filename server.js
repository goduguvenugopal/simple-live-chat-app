const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Store users and rooms
const users = {};

// Handle socket connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handling user joining a room
  socket.on("join-room", ({ person_name, room_Name }) => {
    socket.join(room_Name);
    users[socket.id] = { person_name, room_Name };

    // Notify user that they joined the room
    socket.emit("message", `Welcome ${person_name}! You joined room: ${room_Name}`);
    
    // Notify others in the room
    socket.to(room_Name).emit("message", `${person_name} joined the chat`);
  });

  // Handle sending messages to a specific room
  socket.on("send-message", ({ room_Name, message }) => {
    if (users[socket.id]) {
      io.to(room_Name).emit("message", message);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      socket.to(user.room_Name).emit("message", `${user.person_name} left the chat`);
      delete users[socket.id];
    }
  });
});

server.listen(9000, () => {
  console.log("Server started at port 9000");
});
