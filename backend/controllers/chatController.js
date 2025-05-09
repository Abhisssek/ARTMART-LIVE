// controllers/chatController.js
const Chat = require('../models/ChatSchema');

exports.getChats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    // Show chats where the user is either the sender or receiver
    const chats = await Chat.find({
      $or: [
        { senderRole: userRole },
        { receiverRole: userRole },
        { userId: userId }, // 👈 include this to fetch user's own messages
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
