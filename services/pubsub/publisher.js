const pubsub = require("./client");
const topicName = process.env.TOPIC_NAME;

// allowed eventTypes - 'CONTACT_CREATED', 'CONTACT_UPDATED', 'CONTACT_DELETED'

async function publishEvent(eventType, contactData, userEmail) {
  const payload = {
    eventType: eventType,
    userEmail: userEmail,
    contact: contactData,
    timestamp: new Date().toISOString(),
  };

  const dataBuffer = Buffer.from(JSON.stringify(payload));

  try {
    const messageId = await pubsub
      .topic(topicName)
      .publishMessage({ data: dataBuffer });
    console.log(`Event [${eventType}] published. ID: ${messageId}`);
  } catch (error) {
    console.error(`Failed to publish event: ${error.message}`);
  }
}

module.exports = { publishEvent };
