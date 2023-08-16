const { Joi, celebrate } = require('celebrate');

const { urlRegexPattern } = require('../config');

const userIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(), // user id ex: 64d4f8e35509c9c8703bfc91
  }),
});

const userInfoUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const userAvatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegexPattern).required(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    // Идентификаторы в MongoDB представляют из себя шестнадцатеричные числа длиной 24 символа.
    cardId: Joi.string().length(24).hex().required(), // card ID for ex: 64da2873bf5829cc6784e410
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlRegexPattern).required(),
  }),
});

const userSigninValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const userSignupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegexPattern),
  }),
});

module.exports = {
  userIdValidation,
  userInfoUpdateValidation,
  userAvatarUpdateValidation,
  cardIdValidation,
  createCardValidation,
  userSigninValidation,
  userSignupValidation,
};
