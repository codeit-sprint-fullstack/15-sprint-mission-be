import { HttpException } from './http-exception.js';

export class BadRequestException extends HttpException {
  constructor(message = 'BAD_REQUEST') {
    super(400, message);
  }
}
