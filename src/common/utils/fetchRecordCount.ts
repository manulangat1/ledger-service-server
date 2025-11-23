import { DataSource } from 'typeorm';

const fetchRecordCount = async (
  entity: any,
  dataSource: DataSource,
): Promise<any> => {
  const recordsCount = await dataSource.getRepository(entity).count();
  return recordsCount;
};
export default fetchRecordCount;

/**
 * Parse decimal number with specified decimal points.
 *
 * @param value number to be parsed
 * @param decimals allowed decimal points. Default: 2
 * @returns
 */
export const parseToNumberWithDecimals = (
  value: number,
  decimals?: number,
): number => Number(value.toFixed(decimals || 2));
