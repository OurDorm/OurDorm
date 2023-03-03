const express = require('express');
const app = express()
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");


app.use(cors());
const server = http.createServer(app);

// socket.io connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('send_message', (task) => {
    socket.broadcast.emit('receive_message', task)
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});