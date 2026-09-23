import { HttpException } from './http-exception.js';

export class NotFoundException extends HttpException {
  constructor(message = 'NOT_FOUND') {
    super(404, message);
  }
}
