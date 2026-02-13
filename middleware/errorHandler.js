const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  console.log("[errorHandler]Error occurred:", err.message);

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation failed",
        message: err.message,
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        title: "Not found",
        message: err.message,
      });
      break;

    case constants.ISE:
      res.status(statusCode).json({
        title: "Server error",
        message: err.message,
      });
      break;

    default:
      console.log("No error, all good!");
      break;
  }
};

module.exports = errorHandler;
