const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  reportCount,
  reportMarkedRead,
  mySubmittedReport
} = require('../controllers/reportController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Create a report
router.post('/report/:auctionId', isAuthenticatedUser, createReport);

// Get all reports (admin only)
router.get('/reports', isAuthenticatedUser, authorizeRoles('admin'), getReports);

// Get single report by ID (admin only)
router.get('/report/:reportId', isAuthenticatedUser, authorizeRoles('admin'), getReportById);

// Update report status (admin only)
router.put('/update/report/:reportId', isAuthenticatedUser, authorizeRoles('admin'), updateReportStatus);

// Delete a report (admin only)
router.delete('/delete/report/:reportId', isAuthenticatedUser, authorizeRoles('admin'), deleteReport);

router.put('/mark-read-reports', isAuthenticatedUser, authorizeRoles('admin'), reportMarkedRead);

router.get('/report-count', isAuthenticatedUser, authorizeRoles('admin'), reportCount);

router.get('/my-submitted-report', isAuthenticatedUser,  mySubmittedReport);

module.exports = router;
