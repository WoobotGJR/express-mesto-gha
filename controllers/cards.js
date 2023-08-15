const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new Error('UndefinedIdError'))
    .then((card) => {
      if (card.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Доступ к ресурсу запрещён'); // Throw переводит обработку в блок catch
      }

      return Card.findByIdAndRemove(req.params.id).then(res.send({ data: card }));
    })
    .catch((err) => {
      if (err.message === 'UndefinedIdError') {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else {
        next();
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('UndefinedIdError'))
    .then((updatedCard) => res.send({ data: updatedCard }))
    .catch((err) => {
      if (err.message === 'UndefinedIdError') {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else {
        next();
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('UndefinedIdError'))
    .then((updatedCard) => res.send({ data: updatedCard }))
    .catch((err) => {
      if (err.message === 'UndefinedIdError') {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else {
        next();
      }
    });
};
