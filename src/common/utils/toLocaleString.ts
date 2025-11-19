export const convertToLocaleStr = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export const convertLocaleStringToNumber = (amount: string): number => {
  return parseFloat(amount.replace('/[^d.-]/g', ''));
};
