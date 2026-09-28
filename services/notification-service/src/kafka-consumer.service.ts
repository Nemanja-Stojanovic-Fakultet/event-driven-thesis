import { KafkaService, OrderCreatedMessage } from "@evt/kafka";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationEntity } from "./notification.entity";

@Injectable()
export class KafkaConsumerService {
  @InjectRepository(NotificationEntity)
  private readonly notificationOrdersRepo: Repository<NotificationEntity>;

  constructor(private kafkaService: KafkaService) {
    this.kafkaService.consumeMessages(
      "order.created",
      "notification-service",
      this.handleMessage.bind(this),
    );
  }

  async handleMessage(message: OrderCreatedMessage) {
    console.log(`Notification service received order message`, message);
    this.create(message.batchId, message.batchItemId);
  }

  async create(batch_id, batch_item_id) {
    const notificationEntity = await this.notificationOrdersRepo.create({
      batch_id,
      batch_item_id,
    });

    return this.notificationOrdersRepo.save(notificationEntity);
  }
}
