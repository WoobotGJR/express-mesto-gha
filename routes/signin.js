const router = require('express').Router();
const { login } = require('../controllers/users');
const { userSigninValidation } = require('./routeValidationRules');

router.post('/signin', userSigninValidation, login);

module.exports = router;
