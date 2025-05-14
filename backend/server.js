const express = require('express');
const http = require('http'); // Added for Socket.io
const { Server } = require('socket.io'); // Directly use socket.io here
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2;
const Chat = require('./models/ChatSchema');

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

// Initialize Socket.io
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true }
});

// Store the io instance globally so controllers can access it
app.set("socketio", io);

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
}));

// Connect to MongoDB
connectDB();

// Import all routes
const userRoute = require('./routes/userRoute');
const auctionRoute = require('./routes/auctionRoute');
const bidRoute = require('./routes/bidRoute');
const superAdminRoute = require('./routes/superAdminRoute');
const paymentRoute = require('./routes/paymentRoute');
const commissionRoute = require('./routes/commissionRoute');

app.use('/api/v1/user', userRoute);
app.use('/api/v1/auction', auctionRoute);
app.use('/api/v1/bid', bidRoute);
app.use('/api/v1/admin', superAdminRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/commission", commissionRoute);
app.use('/api/v1/report-auction', require('./routes/reportRoutes'));

app.get('/success', (req, res) => {
    res.send('Payment successful');
});
app.get('/cancel', (req, res) => {
    res.send('Payment cancelled');
});

// Start cron jobs
const endedAuctionCron = require('./automation/endedAuctionCron');
endedAuctionCron();
const verifyCommissionCron = require('./automation/verifyCommissionCron');
verifyCommissionCron();
const notifyAuctionStartCron = require('./automation/notifyAuctionStartCron');
notifyAuctionStartCron();

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join the room based on the role (admin, auctioneer, bidder)
  socket.on("join_room", (role) => {
    socket.join(role); // e.g., "admin", "auctioneer", "bidder"
    console.log(`${socket.id} joined room: ${role}`);
  });


  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
    console.log(`${socket.id} joined auction room: ${auctionId}`);
  });

  // When a message is sent from one role to another
  socket.on('send_message', async (data) => {
    const { senderName, message, receiverRole, senderId  } = data;

    // Save the message to DB including userId
    const chat = new Chat({
      userId: senderId, // ✅ now userId is correctly set
      senderRole: socket.handshake.query.role,
      senderName,
      receiverRole,
      message,
    });
    await chat.save();

    // Emit to both sender and receiver room
    io.to(receiverRole).emit('receive_message', data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'dist'))); // or 'dist' for Vite

// For any other route, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); // or 'dist'
});



server.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT);
});
