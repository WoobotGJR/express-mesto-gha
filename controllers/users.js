const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка при получении списка пользователей' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('UndefinedIdError'))
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя по id' });
      } else if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(500).send({ message: 'Произошла непредвиденная ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
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
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        } else {
          res.status(500).send({ message: 'Ошибка при создании пользователя' });
        }
      }))
    .catch((err) => res.status(400).send(err));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail('UndefinedIdError')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при редактировании информации о пользователе' });
      } else if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка при обновлении информации о пользователе' });
      }
    });
};

// без опции runValidators можно будет отправить запрос с данными, не подходящими к схеме - https://mongoosejs.com/docs/validation.html
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail('UndefinedIdError')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при редактировании информации о пользователе' });
      } else if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка при обновлении информации о пользователе' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', // cгенерирован единожды с помощью node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 604800000, // длительность - 1 неделя, умножено на 1000, так как maxAge в мс
          httpOnly: true,
        }); // в данном случае .end() приводит к ошибке - https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client

      res.send(token);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getCurrentUserInfo = (req, res) => {
  const currentUserId = req.user._id;

  User.findById(currentUserId)
    .orFail('UndefinedIdError')
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при получении данных пользователя' });
      } else if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(500).send({ message: 'Произошла непредвиденная ошибка' });
      }
    });
};
