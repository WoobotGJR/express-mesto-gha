const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers; // authorization: '5543044c-fd15-4f3f-9950-66b2e3519db9' ex

  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization); // 'eyJhbGciOi...'
  // console.log(token);

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // console.log(err);
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // { _id: '64d7e2b8205bb555bc13e8be', iat: 1691931048, exp: 1692535848 }

  next();
};
