require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const signinRoute = require('./routes/signin');
const signupRoute = require('./routes/signup');

const auth = require('./middlewares/auth');

const { PORT, dataBaseUrl } = require('./config');

// https://stackoverflow.com/questions/69195824/trying-to-connect-mongodb-to-my-web-app-but-it-shows-following-error
mongoose.connect(dataBaseUrl, {
  useNewUrlParser: true,
});

const app = express();

app.use(helmet()); // https://expressjs.com/ru/advanced/best-practice-security.html

app.use(cookieParser());

app.use('/', signinRoute);
app.use('/', signupRoute);

app.use('/users', auth, usersRoute);
app.use('/cards', auth, cardsRoute);

app.use(errors());

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

// Общий обработчик ошибок
app.use(errorHandler); // вынесен в middleware

// app.use(express.static(__dirname));
app.listen(PORT);
