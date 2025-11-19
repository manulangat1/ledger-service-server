import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';
import { EnvironmentEnum } from '../../common/constants/types.enum';

@Exclude()
export class EnvironmentVariablesDTO {
  @Expose()
  @IsEnum(EnvironmentEnum)
  environment: EnvironmentEnum;

  @Expose()
  @IsNumber()
  port: number;

  @Expose()
  @IsNotEmpty()
  TOKEN_EXPIRATION: string;

  @Expose()
  @IsUrl({ require_tld: false })
  CLIENT_HOST_NAME: string;

  @Expose()
  @IsUrl({ require_tld: false })
  ADMIN_HOST_NAME: string;
}
