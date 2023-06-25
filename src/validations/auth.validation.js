const Joi = require("joi");
const { password } = require("./custom.validation");

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
const register = {
  body: Joi.object().keys({
    // userId: Joi.string().custom(objectId),
    // walletMoney: Joi.number().required(),
    // address: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password)
  })
}
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  body: Joi.object().keys({
    // userId: Joi.string().custom(objectId),
    // walletMoney: Joi.number().required(),
    // address: Joi.string(),
    // name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
};

module.exports = {
  register,
  login,
};
