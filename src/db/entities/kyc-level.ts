import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KycRequirements } from '../../common/constants/general.constants';

@Entity()
export class KycLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  level: number;

  @Column({ type: 'jsonb' })
  requirements: KycRequirements;

  @Column({
    type: 'double precision',
    nullable: true,
  })
  minInvestmentAmount: number;

  //   TODO: add currency

  // TODO: add link to investor

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
