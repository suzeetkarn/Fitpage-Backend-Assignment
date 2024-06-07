const { Joi } = require("express-validation");

module.exports = {
  location: {
    body: Joi.object({
      name: Joi.string().required(),
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
    }),
  }
};
