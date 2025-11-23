import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransferToTransactionStatusEnum1763884536839 implements MigrationInterface {
    name = 'AddTransferToTransactionStatusEnum1763884536839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_51ed5187d7040f6887e655c7b4"`);
        await queryRunner.query(`ALTER TYPE "public"."wallet_transaction_source_enum" RENAME TO "wallet_transaction_source_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_source_enum" AS ENUM('TOP_UP', 'REFUND', 'WITHDRAW', 'TRANSFER')`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ALTER COLUMN "source" TYPE "public"."wallet_transaction_source_enum" USING "source"::"text"::"public"."wallet_transaction_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_source_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_51ed5187d7040f6887e655c7b4" ON "wallet_transaction" ("source", "status", "operation") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_51ed5187d7040f6887e655c7b4"`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_source_enum_old" AS ENUM('TOP_UP', 'REFUND', 'WITHDRAW')`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ALTER COLUMN "source" TYPE "public"."wallet_transaction_source_enum_old" USING "source"::"text"::"public"."wallet_transaction_source_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_source_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."wallet_transaction_source_enum_old" RENAME TO "wallet_transaction_source_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_51ed5187d7040f6887e655c7b4" ON "wallet_transaction" ("operation", "source", "status") `);
    }

}
