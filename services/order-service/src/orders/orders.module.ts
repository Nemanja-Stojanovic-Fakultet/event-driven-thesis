import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersEntity } from "./entities/orders.entity";
import { OutboxEntity } from "./entities/outbox.entity";
import { OutboxService } from "./outbox.service";

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, OutboxEntity])],
  providers: [OutboxService],
  controllers: [OrdersController],
})
export class OrdersModule {}
