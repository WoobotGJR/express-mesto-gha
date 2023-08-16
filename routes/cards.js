const router = require('express').Router();

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

router.delete('/:cardId', cardIdValidation, deleteCardById);

router.post('/', createCardValidation, createCard);

router.put('/:cardId/likes', cardIdValidation, likeCard);

router.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
