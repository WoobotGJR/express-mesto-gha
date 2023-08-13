const router = require('express').Router();

const {
  getUserById,
  getUsers,
  updateAvatar,
  updateUserInfo,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/me', getCurrentUserInfo);

router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
