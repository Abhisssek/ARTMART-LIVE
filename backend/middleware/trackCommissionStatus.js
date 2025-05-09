const User = require("../models/userSchema");

const trackCommissionStatus =
    async (req, res, next) => {
      const user = await User.findById(req.user._id);
      if (user.unpaidCommission > 0) {
        return res.status(400).json({
          message: "You have unpaid commissions. Please pay them first. before creating new auction",
        });
      }
      next();
    };

module.exports = trackCommissionStatus;