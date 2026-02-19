require("dotenv").config();
const pubsub = require("./services/pubsub/client");
const AsyncJobService = require("./services/AsyncJobService");

const subscriptionName = process.env.SUBSCRIPTION_NAME;

function startWorker() {
  console.log("Worker process started...");

  const subscription = pubsub.subscription(subscriptionName);

  subscription.on("message", async (message) => {
    try {
      const data = JSON.parse(message.data.toString());

      await AsyncJobService.handleEvent(data);

      message.ack();
    } catch (err) {
      console.error("Error occurred while processing message:", err);

      message.nack();
    }
  });

  subscription.on("error", (error) => {
    console.error("Error occurred in subscription:", error);
  });
}

startWorker();
