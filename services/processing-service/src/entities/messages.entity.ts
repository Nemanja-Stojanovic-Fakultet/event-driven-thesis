import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("messages")
export class MessagesEntity {
  @PrimaryGeneratedColumn("uuid", {
    primaryKeyConstraintName: "pk_message_id",
  })
  id: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  message_id: string;

  @Column({ type: "varchar", nullable: false })
  status: string;

  @Column({ type: "json", nullable: false })
  message: string;
}
