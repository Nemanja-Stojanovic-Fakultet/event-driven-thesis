import { Controller, Get, Query } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { OrderCreatedMessage } from "@evt/kafka";
import { OrdersEntity } from "./entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Type } from "class-transformer";
import { IsString, IsInt } from "class-validator";
import { randomUUID as uuidv4 } from "node:crypto";
import { OutboxEntity } from "src/orders/entities/outbox.entity";

class OrderRequest {
  @ApiProperty({ type: String })
  @IsString()
  batch_id: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  amount: number;
}

@Controller("order")
@ApiTags("Order")
export class OrdersController {
  @InjectRepository(OrdersEntity)
  private readonly ordersRepo: Repository<OrdersEntity>;

  @Get()
  async receiveOrder(@Query() request: OrderRequest) {
    console.log("Received request", request);

    for (let i = 0; i < request.amount; i++) {
      const event: OrderCreatedMessage = {
        batchId: request.batch_id,
        batchItemId: i.toString(),
        messageId: uuidv4().toString(),
      };
      await this.create(event);
    }

    return "Success";
  }

  async create(event: OrderCreatedMessage) {
    return this.ordersRepo.manager.transaction(async (manager) => {
      const orderEntity = await manager.save(OrdersEntity, {
        batch_id: event.batchId,
        batch_item_id: event.batchItemId,
      });

      await manager.save(OutboxEntity, {
        topic: "order.created",
        payload: JSON.stringify(event),
        status: "PENDING",
      });

      return orderEntity;
    });
  }
}
