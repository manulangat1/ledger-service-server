import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdditionalBaseModels1763591162582 implements MigrationInterface {
    name = 'AddAdditionalBaseModels1763591162582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" SERIAL NOT NULL, "currency" character varying NOT NULL, "minimumInvestableAmount" integer NOT NULL, "maximumInvestableAmount" integer NOT NULL, "name" character varying NOT NULL, "alias" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_operation_enum" AS ENUM('DEBIT', 'CREDIT')`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_currency_enum" AS ENUM('KES')`);
        await queryRunner.query(`CREATE TABLE "wallet_transaction" ("id" SERIAL NOT NULL, "operation" "public"."wallet_transaction_operation_enum" NOT NULL, "originalAmount" double precision NOT NULL, "fee" double precision NOT NULL, "finalAmount" double precision NOT NULL, "previousBalance" double precision NOT NULL, "currentBalance" double precision NOT NULL, "currency" "public"."wallet_transaction_currency_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "walletId" integer, CONSTRAINT "PK_62a01b9c3a734b96a08c621b371" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_status_enum" AS ENUM('ACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "balance" double precision NOT NULL, "status" "public"."wallet_status_enum" NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "currencyId" integer, "transactionsId" integer, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35472b1fe48b6330cd34970956" ON "wallet" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_811b584ced5705c8937beaea07" ON "wallet" ("currencyId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "salt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ADD CONSTRAINT "FK_07de5136ba8e92bb97d45b9a7af" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_811b584ced5705c8937beaea070" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_3d77ad65f6f1934216eca4d299a" FOREIGN KEY ("transactionsId") REFERENCES "wallet_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_3d77ad65f6f1934216eca4d299a"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_811b584ced5705c8937beaea070"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" DROP CONSTRAINT "FK_07de5136ba8e92bb97d45b9a7af"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_811b584ced5705c8937beaea07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35472b1fe48b6330cd34970956"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_status_enum"`);
        await queryRunner.query(`DROP TABLE "wallet_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_operation_enum"`);
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
