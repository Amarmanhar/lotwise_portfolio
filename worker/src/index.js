require("dotenv").config();
const { consumer } = require("./kafka");
const { processTrade } = require("./fifoProcessor");

async function run() {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC,
      fromBeginning: false,
    });

    console.log("Worker listening to Kafka topic:", process.env.KAFKA_TOPIC);

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const trade = JSON.parse(message.value.toString());
          console.log("Processing trade from Kafka:", trade);
          await processTrade(trade);
        } catch (err) {
          console.error("Error processing trade:", err);
        }
      },
    });
  } catch (err) {
    console.error("Worker failed to start:", err);
  }
}

run();
