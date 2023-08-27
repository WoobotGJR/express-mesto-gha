const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    // .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    // метод populate не нужен для удаления карточек
    .orFail(new NotFoundError('Карточка с таким id не найдена'))
    .then((card) => {
      if (card.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Доступ к ресурсу запрещён'); // Throw переводит обработку в блок catch
      }

      return card.deleteOne().then(res.send({ data: card })).catch(next);
    })
    .catch(next); // В данном случае обязательно передать err, чтобы передать ошибку из блока then
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Карточка с таким id не найдена'))
    .then((updatedCard) => res.send({ data: updatedCard }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    // .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Карточка с таким id не найдена'))
    .then((updatedCard) => res.send({ data: updatedCard }))
    .catch(next);
};
