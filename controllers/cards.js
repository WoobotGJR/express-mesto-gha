const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении списка карточек' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      // if (err.name === 'ValidationError') {
      //   res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      // }
      // if {
        res.status(500).send({ message: 'Ошибка при содании карточки' });
      // }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('UndefinedIdError'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      } else if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка при удалении карточки' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('UndefinedIdError'))
    .then((updatedCard) => res.send({ data: updatedCard }))
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      // }
      if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка при постановке лайка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('UndefinedIdError'))
    .then((updatedCard) => res.send({ data: updatedCard }))
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      // }
      if (err.message === 'UndefinedIdError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка при постановке лайка' });
      }
    });
};
