const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

app.use(express.static("public"));
const io = new Server(server);

// Store users and their rooms
const users = {};

//socket.io
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", ({ person_name, room_name }) => {
    // User joins a room
    socket.join(room_name);
    users[socket.id] = { person_name, room_name };
    // Notify the room about the new user
    socket.to(room_name).emit("message", `${person_name} Joined the chat`);
  });

  // Handle user messages
  socket.on("send-message", (message) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room_name).emit("message", message);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      socket
        .to(user.room_name)
        .emit("message", `${user.person_name} left the chat`);
      delete users[socket.id]; // Remove user from tracking
    }
  });
});

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(9000, () => {
  console.log("server started at port number : 9000");
});
