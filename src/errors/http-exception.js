// 나머지 커스텀 오류들의 부모가 되는 HttpException을 만든다. HttpException은 일반적인 Error 클래스를 상속받고, errors 폴더 내의 다른 오류들은 HttpException을 상속받는다.

export class HttpException extends Error {
  statusCode;
  constructor(statusCode, description) {
    super(description);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
