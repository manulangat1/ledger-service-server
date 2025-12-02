import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { genSalt } from 'bcrypt';
import { hashPassword } from '../../common/lib/auth';
import { User } from './user.entity';
import { AdminPermissions } from '../../common/constants/types.enum';
@Entity()
@Index(['email', 'firstName', 'lastName'])
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.createdAt)
  createdUsers: User[];

  @Column({
    type: 'jsonb',
    default: [],
  })
  permissions: AdminPermissions[];

  @BeforeInsert()
  private async generateSaltAndHash(): Promise<void> {
    if (this.password) {
      this.salt = await genSalt();
      this.password = await hashPassword(this.password, this.salt);
    }
  }
}
