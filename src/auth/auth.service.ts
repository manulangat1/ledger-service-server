import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { dataResponse, DataResponseDTO } from '../common/dto/data-response.dto';
import { User } from '../db/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
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

    // save the user.

    const user = await this.userService.create({
      email,
      password,
      username,
      ...rest,
    });

    // return a res
    return dataResponse(user);
  }

  async login() {}

  async loginJWTResponse() {}
}
