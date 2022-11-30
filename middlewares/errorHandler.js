const errorHandler = async (error, req, res, next) => {
  let code = 500;
  let message = "Internal Server Error";

  if (error.name === "NotFound") {
    code = 400;
    message = "Buyer not Found";
  } else if (
    error.name === "invalidToken" ||
    error.name === `JsonWebTokenError`
  ) {
    code = 401;
    message = "authentication failed";
  }
  console.log(error);
  res.status(code).json({ message });
};

module.exports = errorHandler;
