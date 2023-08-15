const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('jwt=', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { cookie } = req.headers; // токен хранится в res.headers в виде cookie: 'jwt=eyJhbGciOi...'
  // console.log(req.headers);

  if (!cookie || !cookie.startsWith('jwt=')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractBearerToken(cookie); // 'eyJhbGciOi...'
  // console.log(token);

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // { _id: '64d7e2b8205bb555bc13e8be', iat: 1691931048, exp: 1692535848 }
  // console.log(payload);

  next();
};
