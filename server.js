const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from the 'public' directory

// Handle new connections
io.on('connection', (socket) => {
    console.log('A player connected');

    // Broadcast player position to all clients
    socket.on('playerMovement', (data) => {
        socket.broadcast.emit('playerMovement', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A player disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
