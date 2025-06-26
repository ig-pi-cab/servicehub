const winston = require("winston");
const { format } = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
  ],
});

module.exports = logger;
