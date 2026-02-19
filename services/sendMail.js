require("dotenv").config();
const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_MAIL_ADDRESS,
        pass: process.env.SENDER_MAIL_PASSWORD,
      },
    });
  }

  async sendMail({ to, subject, text, html }) {
    return await this.transporter.sendMail({
      from: `"MyContacts App" <${process.env.SENDER_MAIL_ADDRESS}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  }
}

module.exports = MailService;
