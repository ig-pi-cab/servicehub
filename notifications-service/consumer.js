const amqp = require("amqplib");
const { sendBookingEmail } = require("./emailSender");
require("dotenv").config();

async function consumeQueue() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  const queue = "booking_created";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());

      await sendBookingEmail({
        to: content.email,
        bookingId: content.bookingId,
        scheduledAt: content.scheduledAt,
      });

      channel.ack(msg);
    }
  });
}

consumeQueue().catch((err) => {
  console.error("Error en consumidor de RabbitMQ:", err);
});
