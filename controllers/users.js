const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(201).send(
        {
          data: {
            name: user.name, // в данном случае свойство select: false в схеме пользователя
            about: user.about, // не отменяет отправление поля password в json ответе
            avatar: user.avatar, // поэтому, вручную пропишем необходимые данные свойства data
            email: user.email,
            _id: user._id,
          },
        },
      ))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
        } else {
          next(err);
        }
      }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// без опции runValidators можно будет отправить запрос с данными, не подходящими к схеме - https://mongoosejs.com/docs/validation.html
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // console.log(user);

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', // cгенерирован единожды с помощью node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 604800000, // длительность - 1 неделя, умножено на 1000, так как maxAge в мс
          httpOnly: true,
          saeSite: 'none',
        }) // в данном случае .end() приводит к ошибке - https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
        .send({ message: 'Authorized', token }); // Данный ответ необходим, так как res.cookie не отправляет токен
    })
    .catch(next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const currentUserId = req.user._id;
  console.log(req.user);

  User.findById(currentUserId)
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};
