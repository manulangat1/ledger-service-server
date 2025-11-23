import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMinAndMaxWithdrawableAmountsToCurrencyTable1763796840879 implements MigrationInterface {
    name = 'AddMinAndMaxWithdrawableAmountsToCurrencyTable1763796840879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "minimumInvestableAmount"`);
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "maximumInvestableAmount"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "minimumTopUpAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "maximumWithdrawableAmount" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "maximumWithdrawableAmount"`);
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "minimumTopUpAmount"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "maximumInvestableAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "currency" ADD "minimumInvestableAmount" integer NOT NULL`);
    }

}
