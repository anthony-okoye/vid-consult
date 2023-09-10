const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { ExpressPeerServer } = require('peer'); // PeerJS server module
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the Socket.io client library
const socketIoClientPath = '/socket.io/socket.io.js';
app.get(socketIoClientPath, (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidconsult', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Peer server (you can remove this if using a CDN for PeerJS)
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use('/peerjs', peerServer);

// Serve static files (e.g., HTML, CSS) from a 'public' directory
app.use(express.static('public'));

// Socket.io handling
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // Handle WebRTC signaling and communication here
  // Handle WebRTC video chat
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);

    // Inform other users in the room about the new user
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  // Handle text chat
  socket.on('chat-message', (roomId, message) => {
    // Broadcast the message to all users in the room
    io.to(roomId).emit('chat-message', message);
  });
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
