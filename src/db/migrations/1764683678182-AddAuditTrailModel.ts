import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditTrailModel1764683678182 implements MigrationInterface {
    name = 'AddAuditTrailModel1764683678182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_trail" ("id" integer NOT NULL, "description" character varying NOT NULL, "event" character varying NOT NULL, "userId" integer, "adminId" integer, CONSTRAINT "PK_91aade8e45ada93f7dc98ca7ced" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audit_trail" ADD CONSTRAINT "FK_3dae5775bdd4f991d6faa4dbe15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_trail" ADD CONSTRAINT "FK_fd21ffa2ffb9c856c5a6f051a14" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_trail" DROP CONSTRAINT "FK_fd21ffa2ffb9c856c5a6f051a14"`);
        await queryRunner.query(`ALTER TABLE "audit_trail" DROP CONSTRAINT "FK_3dae5775bdd4f991d6faa4dbe15"`);
        await queryRunner.query(`DROP TABLE "audit_trail"`);
    }

}
