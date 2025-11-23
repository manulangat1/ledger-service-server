import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { dataResponse, DataResponseDTO } from '../common/dto/data-response.dto';
import { User } from '../db/entities/user.entity';
import { LoginDTO } from '../user/dto/login-user.dto';
import { _400 } from '../common/constants/error_messages';
import { comparePassword } from '../common/lib/auth';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { LoginUserDTO } from '../common/dto/login-response.dto';
import { OkResponse } from '../common/dto/ok-response.dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  async create(dto: CreateUserDto): Promise<DataResponseDTO> {
    this.logger.log(`Creating a new user with email ${dto.email}`);

    const { email, password, username, ...rest } = dto;

    // check whether email  and username exists.

    const [emailExists, usernameExists] = await Promise.all([
      await this.userService.findByEmail(email),
      await this.userService.findByUsername(username),
    ]);

    // TODO: come and throw specific error messages.
    if (emailExists) {
      throw new BadRequestException();
    }
    if (usernameExists) {
      throw new BadRequestException();
    }

    // TODO: Intergrate email sending capabilities.

    const user = await this.userService.create({
      email,
      password,
      username,
      ...rest,
    });

    return dataResponse(user);
  }

  async login(dto: LoginDTO) {
    this.logger.log(`Logging user with email ${dto.email}`);
    // check whether user exists.
    const { email, password } = dto;
    const user = await this.userService.findByEmailWithSelect(email);

    // if no user exists, throw an error!

    if (!user) throw new BadRequestException(_400.INVALID_CREDENTIALS);

    // check for password match.
    const passwordMatch = await comparePassword(user, password);

    if (!passwordMatch) throw new BadRequestException(_400.INVALID_CREDENTIALS);

    const transposedUser = plainToInstance(LoginUserDTO, user);

    return this.responseBuilder(transposedUser);
  }

  async generateJwtToken(payload: LoginUserDTO): Promise<string> {
    const token = await this.jwtService.sign({
      sub: payload.id,
      email: payload.email,
    });
    return token;
  }

  async adminLogin(dto: LoginDTO): Promise<any> {
    this.logger.log(`Logging user with email ${dto.email}`);
    // check whether user exists.
    const { email, password } = dto;

    const admin = await this.adminService.findByEmailWithSelect(email);

    if (!admin) throw new BadRequestException(_400.INVALID_CREDENTIALS);

    // check for password match.
    const passwordMatch = await comparePassword(admin, password);

    if (!passwordMatch) throw new BadRequestException(_400.INVALID_CREDENTIALS);

    const transposedUser = plainToInstance(LoginUserDTO, admin);

    return this.responseBuilder(transposedUser);
  }

  // TODO: come and build this out as well for admin accounts.
  private async responseBuilder(user: LoginUserDTO) {
    const accessToken = await this.generateJwtToken(user);

    return {
      message: 'Successfully logged in',
      accessToken,
      user,
    };
  }
}
