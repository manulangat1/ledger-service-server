import { User } from '../../db/entities/user.entity';

export const SWAGGER_DOCUMENTATION_PATH = 'api/documentation';

export const ALLOWED_CHARS_REGEX = /[^a-zA-Z0-9À-ž',/.+\-_ ]/g; // Allowed special chars: (') (,) (.) (+) (-)(/)
export const ALLOWED_CHARS_AND_EMAIL_REGEX = /[^a-zA-Z0-9À-ž',/.+\-_@ ]/g; // Allowed special chars: (') (,) (.) (+) (-) (@)
export const PASSWORD = 'password';
export const EMAIL = 'email';

export const ADMIN_PERMISSIONS = 'ADMIN_PERMISSIONS';

export const AUDIT_TRAIL_DESCRIPTION = 'AUDIT_TRAIL_DESCRIPTION';

type KycRequirementFields = Pick<
  InstanceType<typeof User>,
  //   | 'dateOfBirth'
  // | 'gender'
  | 'taxPayerNumber'
  | 'identificationType'
  | 'identificationCountry'
  | 'identificationNumber'
  | 'identificationFrontSide'
  | 'facePhoto'
  | 'proofOfAddress'
  | 'taxPinCertificate'
  | 'employmentStatus'
  //   | 'sourceOfFunds'
  | 'nextOfKinNames'
  | 'nextOfKinContact'
  | 'nextOfKinEmail'
  | 'country'
  | 'city'
  | 'postalCode'
  | 'residentialAddress'
>;
export type KycRequirements = { [key in keyof KycRequirementFields]: boolean };
