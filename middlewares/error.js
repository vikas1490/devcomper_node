const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  let error = { ...err };

  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  //Mongoose duplicate key error

  if (err.code === 11000) {
    const message = `Resource already exist`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(error.errors).map(values => values.message)
    error = new ErrorResponse(message, 404);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
