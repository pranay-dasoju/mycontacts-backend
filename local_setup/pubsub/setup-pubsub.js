// One time setup file for creating Topic and Subscription in google cloud local pub/sub emulator
require("dotenv").config();
const pubsub = require("../../services/pubsub/client");

async function setup() {
  const topicName = process.env.TOPIC_NAME;
  const subscriptionName = process.env.SUBSCRIPTION_NAME;

  console.log("Setting up Pub/Sub...");

  try {
    await pubsub.createTopic(topicName);
    console.log(`Topic created: ${topicName}`);
  } catch (e) {
    console.log("[setup-pubsub.js]Error occurred while topic creation:", e.message);
  }

  try {
    await pubsub.topic(topicName).createSubscription(subscriptionName);
    console.log(`Subscription created: ${subscriptionName}`);
  } catch (e) {
    console.error("[setup-pubsub.js]Error occurred while subscription creation:", e.message);
  }
}

setup();
