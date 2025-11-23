import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminTable1763935018262 implements MigrationInterface {
    name = 'AddAdminTable1763935018262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3154d179e9a329fcdfc789504" ON "admin" ("email", "firstName", "lastName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a3154d179e9a329fcdfc789504"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
