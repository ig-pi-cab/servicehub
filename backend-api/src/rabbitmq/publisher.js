const connectRabbitMQ = require("./connection");

async function publishToQueue(queueName, messageObj) {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageObj)), {
    persistent: true,
  });
}

module.exports = { publishToQueue };
