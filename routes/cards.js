const router = require('express').Router();

const { celebrate } = require('celebrate');

const {
  cardIdValidation,
  createCardValidation,
} = require('./routeValidationRules');

const {
  createCard,
  deleteCardById,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', celebrate(cardIdValidation), deleteCardById);

router.post('/', celebrate(createCardValidation), createCard);

router.put('/:cardId/likes', celebrate(cardIdValidation), likeCard);

router.delete('/:cardId/likes', celebrate(cardIdValidation), dislikeCard);

module.exports = router;
