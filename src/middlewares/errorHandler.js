const { internal, isBoom } = require('@hapi/boom');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (error, _req, res, _next) => {
  if (isBoom(error)) {
    console.warn(error);
    return res
      .status(error.output.payload.statusCode)
      .json(error.output.payload);
  }

  console.error(error);

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(internal(String(error), String(error)));
};

module.exports = { errorHandler };
