const router = require('express').Router();

const { celebrate } = require('celebrate');

const {
  userIdValidation,
  userInfoUpdateValidation,
  userAvatarUpdateValidation,
} = require('./routeValidationRules');

const {
  getUserById,
  getUsers,
  updateAvatar,
  updateUserInfo,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo); // get запрос /me должен идти перед /:id, иначе при попытке перейти
router.get('/:id', celebrate(userIdValidation), getUserById); // по /me он будет воспринимать me как id

router.patch('/me', celebrate(userInfoUpdateValidation), updateUserInfo);

router.patch('/me/avatar', celebrate(userAvatarUpdateValidation), updateAvatar);

module.exports = router;
