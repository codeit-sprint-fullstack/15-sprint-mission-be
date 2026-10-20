import { HttpException } from './http-exception.js';

export class UnAuthorizedException extends HttpException {
  constructor(description = 'UNAUTHORIZED') {
    super(401, description);
  }
}
