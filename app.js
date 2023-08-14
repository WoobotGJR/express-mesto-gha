require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');

const dataBaseUrl = 'mongodb://127.0.0.1:27017/mestodb';
const { PORT = 3000 } = process.env;

// https://stackoverflow.com/questions/69195824/trying-to-connect-mongodb-to-my-web-app-but-it-shows-following-error
mongoose.connect(dataBaseUrl, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('DB connected');
  });

const app = express();

app.use(helmet()); // https://expressjs.com/ru/advanced/best-practice-security.html

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, usersRoute);
app.use('/cards', auth, cardsRoute);

app.use(errors());

app.use((err, req, res, next) => {
  console.log(err.status);
  res.status(404);
  res.send({ message: 'Страница не найдена' });
});

// app.use(express.static(__dirname));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
