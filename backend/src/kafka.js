const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "lotwise-backend",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

async function initProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}

async function publishTrade(trade) {
  await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [{ value: JSON.stringify(trade) }],
  });
}

module.exports = { producer, initProducer, publishTrade };
