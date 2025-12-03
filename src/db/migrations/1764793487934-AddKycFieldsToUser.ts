import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKycFieldsToUser1764793487934 implements MigrationInterface {
    name = 'AddKycFieldsToUser1764793487934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_identificationtype_enum" AS ENUM('NATIONAL_ID', 'PASSPORT')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "identificationType" "public"."user_identificationtype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "identificationCountry" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "identificationNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "identificationFrontSide" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "postalAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "postalCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "residentialAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "proofOfAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "employmentStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nextOfKinNames" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nextOfKinContact" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nextOfKinEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "taxPinCertificate" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "taxPayerNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "facePhoto" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "kycStatus" character varying NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "kycSubmittedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "kycEvaluatedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "kycEvaluatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "kycSubmittedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "kycStatus"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facePhoto"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "taxPayerNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "taxPinCertificate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nextOfKinEmail"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nextOfKinContact"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nextOfKinNames"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "employmentStatus"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "proofOfAddress"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "residentialAddress"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postalCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postalAddress"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "identificationFrontSide"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "identificationNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "identificationCountry"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "identificationType"`);
        await queryRunner.query(`DROP TYPE "public"."user_identificationtype_enum"`);
    }

}
