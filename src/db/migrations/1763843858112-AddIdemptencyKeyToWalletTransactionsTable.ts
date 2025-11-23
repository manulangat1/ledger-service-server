import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdemptencyKeyToWalletTransactionsTable1763843858112 implements MigrationInterface {
    name = 'AddIdemptencyKeyToWalletTransactionsTable1763843858112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ADD "idempotencyKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ADD CONSTRAINT "UQ_2468edd196dbb4e0da7d9ce0f88" UNIQUE ("idempotencyKey")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transaction" DROP CONSTRAINT "UQ_2468edd196dbb4e0da7d9ce0f88"`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" DROP COLUMN "idempotencyKey"`);
    }

}
