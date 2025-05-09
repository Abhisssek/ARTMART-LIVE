const User = require('../models/userSchema');
const Auction = require('../models/auctionSchema');
const Report = require('../models/reportSchema');

const mongoose = require('mongoose');

const createReport = async (req, res) => {
    try {
        const {  reason, description } = req.body;

        const userId = req.user._id; // Assuming user ID is available in req.user
        const auctionId = req.params.auctionId; // Assuming auction ID is passed in the URL
        // Validate userId and auctionId
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(auctionId)) {
            return res.status(400).json({ message: 'Invalid user ID or auction ID' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the auction exists
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        // Create a new report
        const report = new Report({
            userId,
            auctionId,
            reason,
            description,
            status: 'pending'
        });

        await report.save();

        res.status(201).json({ message: 'Report created successfully', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('userId').populate('auctionId');
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ message: 'Invalid report ID' });
        }

        // Check if the report exists
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Update the report status
        report.status = status;
        await report.save();

        res.status(200).json({ message: 'Report status updated successfully', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ message: 'Invalid report ID' });
        }

        // Check if the report exists
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Delete the report
        await Report.findByIdAndDelete(reportId);

        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ message: 'Invalid report ID' });
        }

        // Check if the report exists
        const report = await Report.findById(reportId).populate('userId').populate('auctionId');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}



const reportMarkedRead = async (req, res) => {
    const { role } = req.body;
  
    try {
      await Report.updateMany(
        { "userId.role": role, read: false },
        { $set: { read: true } }
      );
  
      res.status(200).json({ message: "Reports marked as read" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


const reportCount = async (req, res) => {
    try {
        const count = await Report.countDocuments();
        console.log(count);
       
        res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const mySubmittedReport = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is available in req.user

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch reports submitted by the user
        const reports = await Report.find({ userId }).populate('auctionId');

        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createReport,
    getReports,
    updateReportStatus,
    deleteReport,
    getReportById,

    reportMarkedRead,
    reportCount,
    mySubmittedReport
};