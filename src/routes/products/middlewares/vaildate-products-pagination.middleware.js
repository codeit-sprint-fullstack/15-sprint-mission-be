import { BadRequestException } from '#scr/error/bad-request-exception.js';

export const validateProductsPagination = (req, res, next) => {
  const { page, pageSize } = req.query;

  //page, pageSize 기본값 설정
  const pageNumber = Number(page ?? 1);
  const pageSizeNumber = Number(pageSize ?? 10);

  //pageNumver 와 pageSizeNumber 유효성 검사
  const isInvallidpage =
    Number.isNaN(pageNumber) || pageNumber < 1 || !Number.isInteger(pageNumber);
  const isInvalidPageSize =
    Number.isNaN(pageSizeNumber) ||
    pageSizeNumber < 1 ||
    !Number.isInteger(pageSizeNumber) ||
    pageSizeNumber > 100;

  if (isInvallidpage && isInvalidPageSize) {
    throw new BadRequestException('page는 1이상 100이하이여합니다.');
  }

  //페이지네이션
  const skip = (pageNumber - 1) * pageSizeNumber;

  req.validateProductsPagination = {
    page: pageNumber,
    pageSize: pageNumber,
    skip,
  };

  next();
};
