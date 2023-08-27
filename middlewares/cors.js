const allowedCors = [
  'https://woobotgjr.mesto.nomoredomainsicu.ru',
  'http://woobotgjr.mesto.nomoredomainsicu.ru',
  'http://localhost:3001',
];

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const { method } = req;
  // Сохраняем источник запроса в переменную origin
  const { origin } = req.headers;
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту

    return res.end();
  }

  next();
};
