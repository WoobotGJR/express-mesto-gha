const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createUser } = require('../controllers/users');
const { userSignupValidation } = require('./routeValidationRules');

router.post('/signup', celebrate(userSignupValidation), createUser);

module.exports = router;
