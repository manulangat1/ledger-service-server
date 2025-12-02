import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Admin } from './admin.entity';

@Entity()
export class AuditTrail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({})
  event: string;

  @ManyToOne(() => User, (user) => user.auditLogs)
  user: User;

  @ManyToOne(() => Admin, (admin) => admin.auditLogs)
  admin: Admin;
}
