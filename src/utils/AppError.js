/**
 * 애플리케이션 커스텀 에러 클래스
 * @extends Error
 * @param {string} message - 클라이언트에 전달할 에러 메시지
 * @param {number} statusCode - HTTP 상태 코드 (예시: 400, 404, 500, ...)
 * @param {Object} [errorObj] - Zod 검증 에러 등 상세 에러 객체 (선택)
 */
export class AppError extends Error {
  constructor(message, statusCode, errorObj) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorObj = errorObj;
    Error.captureStackTrace(this, this.constructor);
  }
}
