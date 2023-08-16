const router = require('express').Router();

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
router.get('/:id', userIdValidation, getUserById); // по /me он будет воспринимать me как id

router.patch('/me', userInfoUpdateValidation, updateUserInfo);

router.patch('/me/avatar', userAvatarUpdateValidation, updateAvatar);

module.exports = router;
