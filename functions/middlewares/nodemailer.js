const nodemailer = require("nodemailer");

// Create a reusable transporter with SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "kanhaiya@aetherss.com",
    pass: "flqkuphcswxjcykt",
  },
});

/**
 * Send an email using nodemailer.
 *
 * @param {Object} mailOptions - Email options (to, subject, text, html, etc.).
 * @param {Function} callback - Callback function to handle the result (error, info).
 */

function sendEmail(mailOptions, callback) {
  // Add default 'from' address if not provided
  mailOptions.from = mailOptions.from || "your.email@example.com";

  // Send the email
  transporter.sendMail(mailOptions, callback);
}

module.exports = sendEmail;
