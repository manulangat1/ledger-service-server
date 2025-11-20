import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger('User');
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, ...rest } = createUserDto;
    this.logger.log(`Creating a new user with email ${email}`);
    const user = this.userRepository.create({ email, ...rest });
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string): Promise<User | null> {
    const emailExists = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return emailExists;
  }

  async findByUsername(username: string): Promise<User | null> {
    const usernameExists = await this.userRepository.findOneBy({ username });
    return usernameExists;
  }
}
