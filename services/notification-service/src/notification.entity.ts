import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid", {
    primaryKeyConstraintName: "pk_notification_id",
  })
  id: string;

  @Column({ type: "varchar", nullable: false })
  batch_id: string;

  @Column({ type: "varchar", nullable: false })
  batch_item_id: string;
}
