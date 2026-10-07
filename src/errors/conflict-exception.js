import { HttpException } from './http-exception.js';

export class ConflictException extends HttpException {
  constructor(message = 'CONFLICT') {
    super(409, message);
  }
}
