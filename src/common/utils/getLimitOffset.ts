/**
 * Calculates the offset based on the limit and page number
 * Takes the page and limit from the pagination dto.
 * Returns the off set based on the above.
 */

import { PaginationDto } from '../dto/pagination.dto';

export const calculateOffset = (dto: PaginationDto): any => {
  const { page = 1, limit = 10 } = dto;
  const offset = (page - 1) * limit;
  return offset;
};
