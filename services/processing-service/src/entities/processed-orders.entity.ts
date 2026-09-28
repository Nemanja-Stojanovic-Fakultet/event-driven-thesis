import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("processed_orders")
export class ProcessedOrdersEntity {
  @PrimaryGeneratedColumn("uuid", {
    primaryKeyConstraintName: "pk_processed_order_id",
  })
  id: string;

  @Column({ type: "varchar", nullable: false })
  batch_id: string;

  @Column({ type: "varchar", nullable: false })
  batch_item_id: string;
}
