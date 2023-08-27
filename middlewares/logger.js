const winston = require('winston');
const expressWinston = require('express-winston');

// Логгер запросов
const requestLogger = expressWinston.logger({
  // transports — массив, в него можно записать и другие транспорты
  transports: [
    new winston.transports.File({ filename: 'request.log' }), // Опция transports отвечает за то, куда нужно писать лог
  ],
  // format отвечает за формат записи логов
  format: winston.format.json(),
});

// Логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
