import { KafkaService, OrderCreatedMessage } from "@evt/kafka";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProcessedOrdersEntity } from "./entities/processed-orders.entity";
import { MessagesEntity } from "./entities/messages.entity";

@Injectable()
export class KafkaConsumerService {
  @InjectRepository(ProcessedOrdersEntity)
  private readonly processedOrdersRepo: Repository<ProcessedOrdersEntity>;
  @InjectRepository(MessagesEntity)
  private readonly messagesRepo: Repository<MessagesEntity>;

  constructor(private kafkaService: KafkaService) {
    this.kafkaService.consumeMessages(
      "order.created",
      "processing-service",
      this.handleMessage.bind(this),
    );
  }

  async handleMessage(message: OrderCreatedMessage) {
    console.log(`Processing service received order message`, message);
    const messageEntity = await this.createMessage(message);
    await this.createOrder(message.batchId, message.batchItemId);
    await this.updateMessageStatus(messageEntity.id, "DONE");
  }

  async createOrder(batch_id, batch_item_id) {
    const orderEntity = await this.processedOrdersRepo.create({
      batch_id,
      batch_item_id,
    });

    return this.processedOrdersRepo.save(orderEntity);
  }

  async createMessage(message: OrderCreatedMessage) {
    const messageEntity = await this.messagesRepo.create({
      message_id: message.messageId,
      message: JSON.stringify(message),
      status: "PROCESSING",
    });

    return this.messagesRepo.save(messageEntity);
  }

  async updateMessageStatus(id, status) {
    const messageEntity = await this.messagesRepo.findOne({ where: { id } });

    messageEntity.status = status;
    await this.messagesRepo.save(messageEntity);
  }
}
