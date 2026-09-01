import { HttpException } from "./http-exception";

export class BadRequestException extends HttpException {
  constructor(description = "BAD_REQUEST") {
    super(400, description);
  }
}
