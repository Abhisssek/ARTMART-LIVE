const { Server } = require("socket.io");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust frontend URL if needed
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinAuction", (auctionId) => {
      socket.join(auctionId);
      console.log(`User joined auction: ${auctionId}`);
    });

    socket.on("newBid", (data) => {
      io.to(data.auctionId).emit("updateBid", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;
