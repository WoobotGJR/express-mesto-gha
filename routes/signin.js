const router = require('express').Router();
const { celebrate } = require('celebrate');
const { login } = require('../controllers/users');
const { userSigninValidation } = require('./routeValidationRules');

router.post('/signin', celebrate(userSigninValidation), login);

module.exports = router;
