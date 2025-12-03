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

export enum UserTypesEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AdminPermissions {
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AuditTrailEvents {
  USER_LOGIN = 'USER_LOGIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  USER_PROFILE = 'USER_PROFILE',
  USER_FETCH_TRANSACTIONS = 'USER_FETCH_TRANSACTIONS',
  USER_TOP_UP = 'USER_TOP_UP',
  USER_WITHDRAW = 'USER_WITHDRAW',
  USER_TRANSFER = 'USER_TRANSFER',
}

export enum KycStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  SUBMITTED = 'SUBMITTED',
  REJECTED = 'REJECTED',
}

export enum IdentificationType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
}
