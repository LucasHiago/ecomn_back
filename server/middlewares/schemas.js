const Joi = require("joi");

module.exports = {
  register: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    address: Joi.string().required(),
    password: Joi.string()
      .required()
      .min(6),
    password_confirm: Joi.ref("password")
  }),

  login: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  }),

  adminRegister: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    password_confirm: Joi.ref("password")
  }),

  adminLogin: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
};
