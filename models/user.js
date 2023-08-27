const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: [true, 'Поле "email" должно быть уникальным'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false, // при запросе данное поле не будет отправлено в json
    },
  },
  { versionKey: false },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // console.log('user is null');
        throw new UnauthorizedError('Неправильные логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // console.log('passwords are not the same', password, user.password);
            throw new UnauthorizedError('Неправильные логин или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
