export enum EnvironmentEnum {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export enum PocketStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum WalletTransactionOperation {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum CurrencySymbol {
  KENYAN = 'KES',
}

export enum WalletTransactionSource {
  TOP_UP = 'TOP_UP',
  REFUND = 'REFUND',
  // Related to outgoing transactions
  WITHDRAW = 'WITHDRAW',
  // Related to transfers.
  TRANSFER = 'TRANSFER',
}

export enum WalletTransactionStatus {
  PENDING = 'PENDING',
  REVERSED = 'REVERSED',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  TRANSFER_INCOMPLETE = 'TRANSFER_INCOMPLETE',
}
