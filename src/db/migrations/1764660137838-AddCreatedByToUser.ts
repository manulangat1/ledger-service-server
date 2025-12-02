import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByToUser1764660137838 implements MigrationInterface {
    name = 'AddCreatedByToUser1764660137838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdById" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_f4ca2c1e7c96ae6e8a7cca9df8" ON "user" ("email", "username") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5" FOREIGN KEY ("createdById") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4ca2c1e7c96ae6e8a7cca9df8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdById"`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

}
