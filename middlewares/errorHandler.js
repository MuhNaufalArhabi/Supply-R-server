const errorHandler = async (error, req, res, next) => {
  let code = 500;
  let message = "Internal Server Error";
  console.log(error)
  res.status(code).json({message})
};

module.exports = errorHandler;
