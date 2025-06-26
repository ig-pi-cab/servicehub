const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "sherwood.greenfelder77@ethereal.email",
    pass: "1a8beYtpzXWeK2a8wd",
  },
});

async function sendBookingEmail({ to, bookingId, scheduledAt }) {
  const info = await transporter.sendMail({
    from: '"ServiceHub Notifier" <notifier@servicehub.com>',
    to,
    subject: "Confirmación de Reserva",
    text: `Tu reserva con ID ${bookingId} ha sido agendada para ${scheduledAt}.`,
  });

  console.log("Correo enviado: %s", info.messageId);
  console.log("Vista previa: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = { sendBookingEmail };
