const Joi = require("joi");

const validation = (schema, property) => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    const valid = error === null;

    if (valid) return next();

    const { details } = error;

    const message = details.map(i => i.message).join(",");

    res.status(422).json({ error: message });
  };
};

module.exports = validation;
