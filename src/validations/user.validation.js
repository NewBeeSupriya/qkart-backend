const Joi = require("joi");
const { objectId } = require("./custom.validation");

/**
 * Example url: `/v1/users/:userId`
 * Validate the "userId" url *params* field. "userId" value should be a
 * - string
 * - valid Mongo id -> Use the helper function in src/validations/custom.validation.js
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    // walletMoney: Joi.number().required(),
    // address: Joi.string(),
    // name: Joi.string().required().trim(),
    // email: Joi.string().required().trim().lowercase().email({ tlds: { allow: false } }),
    // password: Joi.string().required().trim().custom(password)
  }),
};


const setAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    address: Joi.string().required().min(20),
  }),
};

module.exports = {
  getUser,
  setAddress,
};
