import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { genSalt } from 'bcrypt';
import { hashPassword } from '../../common/lib/auth';
import { Admin } from './admin.entity';
import { AuditTrail } from './audit-trail.entity';
@Entity()
@Index(['email', 'username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  //   this is the field that will be used  for transfer of funds.
  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.createdUsers, {
    nullable: true,
  })
  createdBy: Admin;

  @OneToMany(() => AuditTrail, (auditTrail) => auditTrail.user)
  auditLogs: AuditTrail[];

  @BeforeInsert()
  private async generateSaltAndHash(): Promise<void> {
    if (this.password) {
      this.salt = await genSalt();
      this.password = await hashPassword(this.password, this.salt);
    }
  }
}
