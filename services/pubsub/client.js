const { PubSub } = require("@google-cloud/pubsub");

if (process.env.NODE_ENV !== "production") {
  process.env.PUBSUB_EMULATOR_HOST = "localhost:8085";
}

const pubsub = new PubSub({ projectId: "my-contacts-project" });

module.exports = pubsub;
