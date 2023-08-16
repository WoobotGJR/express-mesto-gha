const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { userSignupValidation } = require('./routeValidationRules');

router.post('/signup', userSignupValidation, createUser);

module.exports = router;
