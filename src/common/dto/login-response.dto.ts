import { Exclude, Expose } from 'class-transformer';

export class LoginUserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
