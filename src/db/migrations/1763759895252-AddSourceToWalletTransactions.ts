import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSourceToWalletTransactions1763759895252 implements MigrationInterface {
    name = 'AddSourceToWalletTransactions1763759895252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_source_enum" AS ENUM('TOP_UP', 'REFUND', 'WITHDRAW')`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ADD "source" "public"."wallet_transaction_source_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_status_enum" AS ENUM('PENDING', 'REVERSED', 'ARCHIVED', 'COMPLETED', 'IN_PROGRESS', 'TRANSFER_INCOMPLETE')`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ADD "status" "public"."wallet_transaction_status_enum" NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_51ed5187d7040f6887e655c7b4" ON "wallet_transaction" ("source", "status", "operation") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_51ed5187d7040f6887e655c7b4"`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_status_enum"`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" DROP COLUMN "source"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_source_enum"`);
    }

}
