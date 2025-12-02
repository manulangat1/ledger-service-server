import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionsToAdminTable1764680422543 implements MigrationInterface {
    name = 'AddPermissionsToAdminTable1764680422543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" ADD "permissions" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "permissions"`);
    }

}
