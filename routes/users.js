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
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(), // user id ex: 64d4f8e35509c9c8703bfc91
  }),
}), getUserById); // по /me он будет воспринимать me как id

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegexPattern).required(),
  }),
}), updateAvatar);

module.exports = router;
