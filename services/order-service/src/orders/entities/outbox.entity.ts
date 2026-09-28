import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("outbox")
export class OutboxEntity {
  @PrimaryGeneratedColumn("uuid", { primaryKeyConstraintName: "pk_outbox_id" })
  id: string;

  @Column({ type: "varchar", nullable: false })
  topic: string;

  @Column({ type: "varchar", nullable: false })
  status: string;

  @Column({ type: "varchar", nullable: false })
  payload: string;
}
