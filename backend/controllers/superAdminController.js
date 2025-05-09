const mongoose = require("mongoose");

const Commission = require("../models/commissionSchema");
const PaymentProof = require("../models/commissionProofSchema");
const User = require("../models/userSchema");
const Auction = require("../models/auctionSchema");
const Chat = require("../models/ChatSchema");
const Announcement = require("../models/announcementSchema");

exports.deleteAuctionItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Auction ID is required" });
    }

    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }

    await auctionItem.deleteOne();
    return res
      .status(200)
      .json({ message: "Auction item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getAllPaymentProofs = async (req, res) => {
    try{

        let Proof = await PaymentProof.find();
        return res.status(200).json({ Proof });

    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}



exports.getPaymentProofDetails = async (req, res) => {
    try{
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid payment proof ID" });
        }
        if (!id) {
            return res.status(400).json({ message: "Payment proof ID is required" });
        }

        let Proof = await PaymentProof
            .findById(id);
        return res.status(200).json({ Proof });
            
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}


exports.updateProofStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const {status} = req.body;
        if (!id) {
            return res.status(400).json({ message: "Payment proof ID is required" });
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid payment proof ID" });
        }
        // console.log(status);
        
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
       


        let Proof = await PaymentProof.findById(id);
        if (!Proof) {
            return res.status(404).json({ message: "Payment proof not found" });
        }

        Proof = await PaymentProof.findByIdAndUpdate(id, { status}, { new: true, runValidators: true, useFindAndModify: false });
        if(Proof.status === 'settled'){
            const user = await User.findById(Proof.userid);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await User.findByIdAndUpdate(user._id, { $inc: { unpaidCommission: -Proof.amount } }, { new: true });
        }
        return res.status(200).json({ message: "Payment proof updated successfully", PaymentProof });

    } catch (error) {
      console.log(error);
      
        return res.status(500).json({ message: error.message });
    }
}


exports.deletePaymentProof = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Payment proof ID is required" });
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid payment proof ID" });
        }

        let Proof = await PaymentProof.findById(id);
        if (!Proof) {
            return res.status(404).json({ message: "Payment proof not found" });
        }

        await Proof.deleteOne();
        return res.status(200).json({ message: "Payment proof deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { createdAt: { $exists: true, $ne: null } } }, // ✅ Use correct field name
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }, // ✅ Use "createdAt" instead of "createdat"
            year: { $year: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          role: "$_id.role",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    console.log("Aggregated Users Data:", users); // ✅ Debugging output

    const bidders = users.filter((user) => user.role === "bidder");
    const auctioneers = users.filter((user) => user.role === "auctioneer");

    const transformDataToMonthlyArray = (data, totalMonths = 12) => {
      const result = Array(totalMonths).fill(0);
      data.forEach((item) => {
        if (item.month >= 1 && item.month <= 12) {
          result[item.month - 1] = item.count;
        }
      });
      return result;
    };

    const biddersArray = transformDataToMonthlyArray(bidders);
    const auctioneersArray = transformDataToMonthlyArray(auctioneers);

    res.status(200).json({
      success: true,
      biddersArray,
      auctioneersArray,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: error.message });
  }
};



exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid user ID" });
        }

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getAllAuctioneer = async (req, res)=>{
    try {
        const auctioneers = await User.find({ role: "auctioneer" });
        return res.status(200).json({ auctioneers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.getAllBidder = async (req,res)=>{
    try {
        const bidders = await User.find({ role: "bidder" });
        return res.status(200).json({ bidders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.putSuspensionOnUser = async (req,res) =>{
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSuspended = !user.isSuspended; // Toggle suspension status
    await user.save();

    return res.status(200).json({ message: "User suspension status updated successfully", user });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



exports.monthlyRevenue = async (req, res) => {
    const payments = await Commission.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdat" },
            year: { $year: "$createdat" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
  
    const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
      const result = Array(totalMonths).fill(0);
  
      payments.forEach((payment) => {
        result[payment._id.month - 1] = payment.totalAmount;
      });
  
      return result;
    };
  
    const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
    res.status(200).json({
      success: true,
      totalMonthlyRevenue,
    });
  };


  exports.getUserProfileAdmin = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming you have middleware to set req.user
        const user = await User.findById(userId).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }


  exports.deleteAllChats = async (req, res) => {
    try {
        // Delete all documents from the Chat collection
        const result = await Chat.deleteMany({});
        console.log("Delete result:", result);

        return res.status(200).json({ message: "All chats deleted successfully" });
    } catch (error) {
        console.error("Error deleting chats:", error); // Log the error to the console
        return res.status(500).json({ message: "An error occurred while deleting chats", error: error.message });
    }
};



// GET /api/chats/unread-count/:role
exports.unreadCount = async (req, res) => {
  try {
    const count = await Chat.countDocuments({
      receiverRole: req.params.role,
      isRead: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error getting unread count" });
  }
};


// PUT /api/chats/mark-read
exports.markReadChat = async (req, res) => {
  const { role } = req.body;
  try {
    await Chat.updateMany(
      { receiverRole: role, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating messages" });
  }
};


exports.makeAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    console.log("Creating announcement with title:", title); // Debugging output
    console.log("Creating announcement with description:", description); // Debugging output
    
    

    const newAnnouncement = new Announcement({
      title,
      description,
      date: new Date(),
    });

    await newAnnouncement.save();
    return res.status(201).json({
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.putBlacklistOnAuctions = async (req, res) => {
  try {
    const { auctionId } = req.params;
    if (!auctionId) {
      return res.status(400).json({ message: "Auction ID is required" });
    }

    const auctionItem = await Auction.findById(auctionId);
    if (!auctionItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }

    auctionItem.isBlacklisted = !auctionItem.isBlacklisted; // Toggle blacklist status
    await auctionItem.save();

    return res.status(200).json({ 
      message: "Auction item blacklist status updated successfully", 
      blacklisted: auctionItem.isBlacklisted // optional
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()// Populate the createdby field with user details
    return res.status(200).json( auctions );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}