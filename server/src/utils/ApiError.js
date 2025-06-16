class ApiError extends Error {
  constructor(message = "Something went wrong", statusCode = 500) {
    super(message);

    this.name = this.constructor.name;
    this.status = "error";
    this.statusCode = statusCode;
    this.isOperational = true; // Marks it as an expected error

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
