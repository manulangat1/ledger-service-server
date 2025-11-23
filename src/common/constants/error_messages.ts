export const _400 = {
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials supplied.',
  },
  CURRENCY_UNSUPPORTED: {
    code: 'CURRENCY_UNSUPPORTED',
    message: 'Currency provided not supported.',
  },
  WALLET_EXISTS: {
    code: 'WALLET_EXISTS',
    message: 'Wallet exists.',
  },
  WALLET_HAS_INSUFFICIENT_BALANCE: {
    code: 'WALLET_HAS_INSUFFICIENT_BALANCE',
    message:
      'Withdrawn amount is greater than the current balance when withdraw fee is applied',
  },
};
export const _401 = {
  ORIGIN_NOT_SUPPORTED: {
    code: 'ORIGIN_NOT_SUPPORTED',
    message: 'The origin is not allowed by CORS',
  },
};
export const _404 = {
  CURRENCY_UNSUPPORTED: {
    code: 'CURRENCY_UNSUPPORTED',
    message: 'Currency provided not supported.',
  },
  WALLET_DOES_NOT_EXIST: {
    code: 'WALLET_DOES_NOT_EXIST',
    message: 'Wallet does not exist.',
  },
};
export const _500 = {
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something wrong happened',
  },
};
