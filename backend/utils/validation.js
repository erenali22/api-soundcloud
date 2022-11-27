const { validationResult } = require('express-validator');
const { makeError } = require("./auth");

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => ({
        [error.param]: error.msg
      }));

    next(makeError(
      'Validation error',
      400,
      errors
    ));
  }
  next();
};

module.exports = {
  handleValidationErrors
};
