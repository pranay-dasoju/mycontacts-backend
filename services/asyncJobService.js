const MailService = require("./sendMail");

class AsyncJobService {
  static async handleEvent(job) {
    const { eventType, userEmail, contact } = job;

    console.log(`\n Processing Event: ${eventType} for ${userEmail}`);

    switch (eventType) {
      case "CONTACT_CREATED":
        await this.sendContactCreatedMail(contact);
        break;

      case "CONTACT_UPDATED":
        await this.sendContactUpdatedMail(contact);
        break;

      case "CONTACT_DELETED":
        await this.sendContactDeletedMail(contact);
        break;

      default:
        console.log("Undefined event type, ignored");
    }
  }

  static async sendContactCreatedMail(contact) {
    const mailService = new MailService();
    const mailReq = {
      to: process.env.DUMMY_MAIL_ADDRESS,
      subject: "New Contact created!!",
      html: `Please be informed that a new contact - ${contact.name} has been added in your account`,
    };

    mailService.sendMail(mailReq);
    console.log(
      `Mail sent for CONTACT_CREATED event for contact: ${contact.name}`,
    );
  }

  static async sendContactUpdatedMail(contact) {
    const mailService = new MailService();
    const mailReq = {
      to: process.env.DUMMY_MAIL_ADDRESS,
      subject: "Contact updated!!",
      html: `Please be informed that - ${contact.name} contact details have been updated`,
    };

    mailService.sendMail(mailReq);
    console.log(
      `Mail sent for CONTACT_UPDATED event for contact: ${contact.name}`,
    );
  }

  static async sendContactDeletedMail(contact) {
    const mailService = new MailService();
    const mailReq = {
      to: process.env.DUMMY_MAIL_ADDRESS,
      subject: "Contact deleted!!",
      html: `
      <p>Please be informed that - ${contact.name} contact has been deleted.</p>

      <h3>Contact Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${contact.name}</li>
        <li><strong>Email:</strong> ${contact.email}</li>
        <li><strong>Mobile:</strong> ${contact.mobile}</li>
      </ul>
      `,
    };

    mailService.sendMail(mailReq);
    console.log(
      `Mail sent for CONTACT_DELETED event for contact: ${contact.name}`,
    );
  }
}

module.exports = AsyncJobService;
