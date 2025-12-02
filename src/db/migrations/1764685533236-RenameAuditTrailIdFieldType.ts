import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAuditTrailIdFieldType1764685533236 implements MigrationInterface {
    name = 'RenameAuditTrailIdFieldType1764685533236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "audit_trail_id_seq" OWNED BY "audit_trail"."id"`);
        await queryRunner.query(`ALTER TABLE "audit_trail" ALTER COLUMN "id" SET DEFAULT nextval('"audit_trail_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_trail" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "audit_trail_id_seq"`);
    }

}
