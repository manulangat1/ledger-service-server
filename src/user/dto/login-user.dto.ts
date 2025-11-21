import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class LoginDTO extends PickType(CreateUserDto, ['email', 'password']) {}
