import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1790494751648 implements MigrationInterface {
  name = "Init1790494751648";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "processed_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batch_id" character varying NOT NULL, "batch_item_id" character varying NOT NULL, CONSTRAINT "pk_processed_order_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message_id" character varying NOT NULL, "status" character varying NOT NULL, "message" json NOT NULL, CONSTRAINT "UQ_6187089f850b8deeca0232cfeba" UNIQUE ("message_id"), CONSTRAINT "pk_message_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "processed_orders"`);
  }
}
