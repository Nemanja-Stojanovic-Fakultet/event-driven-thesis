import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1790526265223 implements MigrationInterface {
  name = "Init1790526265223";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying NOT NULL, "status" character varying NOT NULL, "payload" character varying NOT NULL, CONSTRAINT "pk_outbox_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batch_id" character varying NOT NULL, "batch_item_id" character varying NOT NULL, CONSTRAINT "pk_order_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "outbox"`);
  }
}
