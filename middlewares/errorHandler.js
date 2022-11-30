const errorHandler = (err, req, res, next) => {
    let code = 500;
    let message = "Internal Server Error";
    if (err.name === "forbidden") {
      code = 403;
      message = "Access Forbidden";
    } else if (err.name === "not_found") {
      code = 404;
      message = "Error not found";
    } else if (err.name == "invalidLogin") {
      code = 401;
      message = "Invalid Email or Password";
    } else if (
      err.name == "SequelizeValidationError" ||
      err.name == "SequelizeUniqueConstraintError"
    ) {
      let errMessage = err.errors.map((el) => el.message);
      code = 400;
      message = errMessage;
    } else if (err.name === "invalid_token" || err.name === "JsonWebTokenError") {
      code = 401;
      message = "Invalid Token";
    } else if(err.name == 'Email is required' || err.name == 'Password is required') {
        code = 400;
        message = err.name;
    }
    res.status(code).json({ message });
  };

  module.exports = errorHandler;