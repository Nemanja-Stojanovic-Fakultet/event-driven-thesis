import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders")
export class OrdersEntity {
  @PrimaryGeneratedColumn("uuid", { primaryKeyConstraintName: "pk_order_id" })
  id: string;

  @Column({ type: "varchar", nullable: false })
  batch_id: string;

  @Column({ type: "varchar", nullable: false })
  batch_item_id: string;
}
