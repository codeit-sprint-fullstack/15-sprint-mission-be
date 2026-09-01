export class HttpException extends Error {
  constructor(statusCode, description) {
    super(description);

    this.statusCode = statusCode;
  }
}
