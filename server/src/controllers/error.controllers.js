import ApiError from "../utils/ApiError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate field value: "${Object.keys(err.keyValue)[0]}", Please use another value!`;
  return new ApiError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new ApiError(message, 400);
};

const handleJwtError = () => {
  return new ApiError("Invalid token! Please log in again", 401);
};

const handleJwtExpireError = () => {
  return new ApiError("Your token has expired! Please log in again", 401);
};

const handleAvatarSizeError = () => {
  return new ApiError("Avatar upload failed. File size must be less than or equals to 1MB", 400);
};

const handleInvalidFileUploadField = (err) => {
  return new ApiError(`Invalid fieldName ${err.field}`, 400);
};

const handleExceedFiles = (err) => {
  return new ApiError(err.message, err.statusCode);
};

const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
   // console.log("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "something went very worng!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  // console.log(err.stack)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);

    if (err.code === 11000) error = handleDuplicateErrorDB(error);

    if (err.name === "ValidationError") error = handleValidationError(error);

    if (err.name === "JsonWebTokenError") error = handleJwtError();

    if (err.name === "TokenExpiredError") error = handleJwtExpireError();

    if (err.code === "LIMIT_FILE_SIZE" && err.field === "avatar") error = handleAvatarSizeError();

    if (err.code === "LIMIT_FILE_COUNT") error = handleExceedFiles(error);

    if (err.code === "LIMIT_UNEXPECTED_FILE") error = handleInvalidFileUploadField(error);

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;