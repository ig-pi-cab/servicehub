const connectRabbitMQ = require("./connection");

async function consumeQueue(queueName, callbackFn) {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await callbackFn(content);
      channel.ack(msg);
    }
  });
}

module.exports = { consumeQueue };
