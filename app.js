/* eslint-disable no-console */
// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Данная конструкция позволяет отправлять _id при каждом запросе
app.use((req, res, next) => {
  req.user = {
    _id: '64c94dce3a879cbee1b461f5',
  };

  next();
});
app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.use((req, res) => {
  res.status(404);
  res.send({ message: 'Страница не найдена' });
});

// app.use(express.static(__dirname));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
