class AppError extends Error {
  constructor(message, statusCode, errorObj) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorObj = errorObj;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
