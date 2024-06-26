const httpStatus = require("http-status");
const expressValidation = require("express-validation");
const APIError = require("../errors/api-error");
const { env } = require("../../config/vars");

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  console.log(err);
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== "development") {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  console.log(err);
  let convertedError = err;
  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: err?.details?.body
        ? err?.details?.body?.map((q) => q.message)?.join(" AND ")
        : err?.details?.query?.map((q) => q.message)?.join(" AND "),
      errors: err.errors,
      status: httpStatus.BAD_REQUEST,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: "Not found",
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res, next);
};
