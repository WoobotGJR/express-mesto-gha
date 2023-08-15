require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');

const dataBaseUrl = 'mongodb://127.0.0.1:27017/mestodb';
const { PORT = 3000 } = process.env;

const urlRegexPattern = /^(http(s):\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

// https://stackoverflow.com/questions/69195824/trying-to-connect-mongodb-to-my-web-app-but-it-shows-following-error
mongoose.connect(dataBaseUrl, {
  useNewUrlParser: true,
});

const app = express();

app.use(helmet()); // https://expressjs.com/ru/advanced/best-practice-security.html

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegexPattern),
  }),
}), createUser);

app.use('/users', auth, usersRoute);
app.use('/cards', auth, cardsRoute);

app.use(errors());

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

// Общий обработчик ошибок
app.use(errorHandler); // вынесен в middleware

// app.use(express.static(__dirname));
app.listen(PORT);
