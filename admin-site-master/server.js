const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    io.emit('message', { user: 'System', msg: `${username} has joined the chat.` });
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    if (socket.username)
      io.emit('message', { user: 'System', msg: `${socket.username} left the chat.` });
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
