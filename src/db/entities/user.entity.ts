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
import {
  IdentificationType,
  KycStatus,
} from '../../common/constants/types.enum';
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

  // start of kyc fields.

  @Column({ type: 'enum', enum: IdentificationType, nullable: true })
  identificationType: IdentificationType;

  @Column('varchar', { nullable: true })
  identificationCountry: string;

  @Column('varchar', { nullable: true })
  identificationNumber: string;

  @Column('varchar', { nullable: true })
  identificationFrontSide: string;

  @Column('varchar', { nullable: true })
  country: string;

  @Column('varchar', { nullable: true })
  city: string;

  @Column('varchar', { nullable: true })
  postalAddress: string;

  @Column('varchar', { nullable: true })
  postalCode: string;

  @Column('varchar', { nullable: true })
  residentialAddress: string;

  @Column('varchar', { nullable: true })
  proofOfAddress: string;

  @Column('varchar', { nullable: true })
  employmentStatus: string;

  @Column('varchar', { nullable: true })
  nextOfKinNames: string;

  @Column('varchar', { nullable: true })
  nextOfKinContact: string;

  @Column('varchar', { nullable: true })
  nextOfKinEmail: string;

  @Column('varchar', { nullable: true })
  taxPinCertificate: string;

  @Column('varchar', { nullable: true })
  taxPayerNumber: string;

  @Column('varchar', { nullable: true })
  facePhoto: string;

  @Column('date', { nullable: true })
  dateOfBirth: Date;

  @Column({ default: KycStatus.PENDING })
  kycStatus: string;

  @Column({ nullable: true })
  kycSubmittedAt: Date;

  @Column({ nullable: true })
  kycEvaluatedAt: Date;

  // @Column({ nullable: true })
  // kycRejectionReason:

  /*  end of kyc fields */
  @BeforeInsert()
  private async generateSaltAndHash(): Promise<void> {
    if (this.password) {
      this.salt = await genSalt();
      this.password = await hashPassword(this.password, this.salt);
    }
  }
}
