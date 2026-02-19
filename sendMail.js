require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendMail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_MAIL_ADDRESS,
      pass: process.env.SENDER_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"MyContacts App" <${process.env.SENDER_MAIL_ADDRESS}>`,
    to: "pranaydasoju2002@gmail.com",
    subject: "Success! Nodemailer is working",
    text: "If you see this, your App Password worked perfectly!",
    html: "<b>Success!</b> Your App Password worked perfectly!",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

sendMail();
