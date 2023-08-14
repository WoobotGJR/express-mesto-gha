const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  getUsers,
  updateAvatar,
  updateUserInfo,
  getCurrentUserInfo,
} = require('../controllers/users');

const urlRegexPattern = /^(http(s):\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo); // get запрос /me должен идти перед /:id, иначе при попытке перейти
router.get('/:id', getUserById); // по /me он будет воспринимать me как id

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegexPattern).required(),
  }),
}), updateAvatar);

module.exports = router;
