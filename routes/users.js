const router = require('express').Router();

const {
  getUserById,
  getUsers,
  updateAvatar,
  updateUserInfo,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo); // get запрос /me должен идти перед /:id, иначе при попытке перейти
router.get('/:id', getUserById); // по /me он будет воспринимать me как id

router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
