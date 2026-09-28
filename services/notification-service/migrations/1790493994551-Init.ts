import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1790493994551 implements MigrationInterface {
  name = "Init1790493994551";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batch_id" character varying NOT NULL, "batch_item_id" character varying NOT NULL, CONSTRAINT "pk_notification_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
