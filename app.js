require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, usersRoute);
app.use('/cards', auth, cardsRoute);

app.use((req, res) => {
  res.status(404);
  res.send({ message: 'Страница не найдена' });
});

// app.use(express.static(__dirname));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
