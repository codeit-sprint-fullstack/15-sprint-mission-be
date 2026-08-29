import { ERROR_MESSAGES } from '#constants';
import { BadRequestException } from '#errors';

export function parseListQuery(query) {
  const offset = Number(query.offset ?? 0);
  const limit = Number(query.limit ?? 10);
  const keyword = typeof query.keyword === 'string' ? query.keyword : '';

  if (!Number.isInteger(offset) || offset < 0) {
    throw new BadRequestException(ERROR_MESSAGES.LIST_QUERY_INVALID);
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new BadRequestException(ERROR_MESSAGES.LIST_QUERY_INVALID);
  }
  if ((query.sort ?? 'recent') !== 'recent') {
    throw new BadRequestException(ERROR_MESSAGES.SORT_OPTION_INVALID);
  }

  return { offset, limit, keyword };
}

export function parseCursorQuery(query) {
  const limit = Number(query.limit ?? 10);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new BadRequestException(ERROR_MESSAGES.LIST_QUERY_INVALID);
  }

  const { cursor } = query;
  if (cursor != null && (!/^\d+$/.test(String(cursor)) || Number(cursor) < 1)) {
    throw new BadRequestException(ERROR_MESSAGES.CURSOR_QUERY_INVALID);
  }

  return { limit, cursor: cursor != null ? Number(cursor) : null };
}
