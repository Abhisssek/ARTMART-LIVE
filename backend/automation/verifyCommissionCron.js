const cron = require("node-cron");
const PaymentProof = require("../models/commissionProofSchema");
const User = require("../models/userSchema");
const Commission = require("../models/commissionSchema");
const { sendEmail } = require("../utils/sendEmail");


const verifyCommissionCron = () => {
    cron.schedule("*/1 * * * *", async () => {
      console.log("Running Verify Commission Cron...");
      const approvedProofs = await PaymentProof.find({ status: "approved" });
      console.log("Approved proofs found:", approvedProofs.length);
      for (const proof of approvedProofs) {
        try {
          const user = await User.findById(proof.userid);
          let updatedUserData = {};
          if (user) {
            if (user.unpaidCommission >= proof.amount) {
              updatedUserData = await User.findByIdAndUpdate(
                user._id,
                {
                  $inc: {
                    unpaidCommission: -proof.amount,
                  },
                },
                { new: true }
              );
              await PaymentProof.findByIdAndUpdate(proof._id, {
                status: "settled",
              });
            } else {
              updatedUserData = await User.findByIdAndUpdate(
                user._id,
                {
                  unpaidCommission: 0,
                },
                { new: true }
              );
              await PaymentProof.findByIdAndUpdate(proof._id, {
                status: "settled",
              });
            }
            try {
              console.log(`Creating commission for user ${user._id}`);
              
              await Commission.create({
                amount: proof.amount,
                user: user._id,
              });
            } catch (err) {
              console.error(`Failed to create commission for user ${user._id}: ${err.message}`);
            }
            const settlementDate = new Date(Date.now())
              .toString()
              .substring(0, 15);
  
            const subject = `Your Payment Has Been Successfully Verified And Settled`;
            const message = `Dear ${user.username},\n\nWe are pleased to inform you that your recent payment has been successfully verified and settled. Thank you for promptly providing the necessary proof of payment. Your account has been updated, and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details:\nAmount Settled: ${proof.amount}\nUnpaid Amount: ${updatedUserData.unpaidCommission}\nDate of Settlement: ${settlementDate}\n\nBest regards,\nARTMART Auction Team`;
            sendEmail({ email: user.email, subject, message });
          }
          console.log(`User ${proof.userid} paid commission of ${proof.amount}`);
        } catch (error) {
          console.error(
            `Error processing commission proof for user ${proof.userid}: ${error.message}`
          );
        }
      }
    });
  };


  module.exports = verifyCommissionCron;