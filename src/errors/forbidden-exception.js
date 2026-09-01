import { HttpException } from "./http-exception";

export class ForbiddenRxception extends HttpException {
  constructor(description = "FORBIDDEN") {
    super(403, description);
  }
}
