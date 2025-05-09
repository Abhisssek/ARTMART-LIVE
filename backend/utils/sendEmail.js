const nodeMailer = require("nodemailer");

exports.sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS-enabled port
    secure: false, // false means STARTTLS (explicit TLS)
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Prevent self-signed certificate errors
    },
  });

  // ✅ Define the `options` object before using it
  const options = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(options);
};
